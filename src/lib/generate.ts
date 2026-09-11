import { createServerFn } from "@tanstack/react-start";
import { eventById, type LookId } from "./events";

export type MomentRecord = {
  id: string;
  eventId: string;
  format: LookId;
  imageUrl: string;
  videoUrl?: string;
  videoRequestId?: string;
  createdAt: number;
  ugcConsent: boolean;
};

const moments = new Map<string, MomentRecord>();
let hourly = { n: 0, t: Date.now() };

function spendOk() {
  const now = Date.now();
  if (now - hourly.t > 60 * 60 * 1000) {
    hourly = { n: 0, t: now };
  }
  if (hourly.n >= 48) return false;
  hourly.n += 1;
  return true;
}

function apiKey() {
  return process.env.XAI_API_KEY?.trim();
}

function firstImageUrl(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const j = json as Record<string, unknown>;
  if (typeof j.url === "string") return j.url;
  const data = j.data;
  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    const d = data[0] as Record<string, unknown>;
    if (typeof d.url === "string") return d.url;
    if (typeof d.b64_json === "string") {
      return `data:image/jpeg;base64,${d.b64_json}`;
    }
  }
  return null;
}

async function editImage(imageDataUrl: string, prompt: string) {
  const key = apiKey();
  if (!key) return { ok: false as const, error: "AI is not available" };
  const res = await fetch("https://api.x.ai/v1/images/edits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-image-2.0",
      prompt,
      image: { url: imageDataUrl, type: "image_url" },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false as const,
      error: `Imagine image ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}`,
    };
  }
  const body = await res.json();
  const url = firstImageUrl(body);
  if (!url) return { ok: false as const, error: "No image returned" };
  return { ok: true as const, url };
}

async function startVideo(imageUrl: string, prompt: string) {
  const key = apiKey();
  if (!key) return { ok: false as const, error: "AI is not available" };
  const res = await fetch("https://api.x.ai/v1/videos/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-video-1.5",
      prompt,
      duration: 6,
      aspect_ratio: "9:16",
      resolution: "720p",
      generate_audio: false,
      image: { url: imageUrl },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false as const,
      error: `Imagine video ${res.status}${text ? `: ${text.slice(0, 180)}` : ""}`,
    };
  }
  const body = (await res.json()) as { request_id?: string };
  if (!body.request_id) return { ok: false as const, error: "No video job" };
  return { ok: true as const, requestId: body.request_id };
}

export const createMoment = createServerFn({ method: "POST" })
  .validator(
    (input: {
      imageDataUrl: string;
      eventId: string;
      format: LookId;
      ugcConsent: boolean;
    }) => input,
  )
  .handler(async ({ data }) => {
    if (!spendOk()) {
      return { ok: false as const, error: "Booth is at capacity — try again shortly." };
    }
    if (!data.imageDataUrl?.startsWith("data:image")) {
      return { ok: false as const, error: "A photo is required." };
    }
    if (data.imageDataUrl.length > 2_400_000) {
      return { ok: false as const, error: "Photo is too large. Retake a little closer." };
    }
    const ev = eventById(data.eventId);
    const prompt =
      data.format === "cover" ? ev.coverPrompt : ev.portraitPrompt;
    const edited = await editImage(data.imageDataUrl, prompt);
    if (!edited.ok) return edited;

    const id = crypto.randomUUID().slice(0, 10);
    const rec: MomentRecord = {
      id,
      eventId: ev.id,
      format: data.format,
      imageUrl: edited.url,
      createdAt: Date.now(),
      ugcConsent: data.ugcConsent,
    };

    if (data.format === "reel") {
      const vid = await startVideo(edited.url, ev.reelPrompt);
      if (vid.ok) rec.videoRequestId = vid.requestId;
    }

    moments.set(id, rec);
    return { ok: true as const, moment: rec };
  });

export const pollReel = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const rec = moments.get(data.id);
    if (!rec) return { ok: false as const, error: "Moment expired" };
    if (rec.videoUrl) return { ok: true as const, moment: rec };
    if (!rec.videoRequestId) {
      return { ok: false as const, error: "No reel in progress" };
    }
    const key = apiKey();
    if (!key) return { ok: false as const, error: "AI is not available" };
    const res = await fetch(
      `https://api.x.ai/v1/videos/${rec.videoRequestId}`,
      { headers: { Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) {
      return { ok: false as const, error: `Video poll ${res.status}` };
    }
    const body = (await res.json()) as {
      status?: string;
      video?: { url?: string };
      error?: { message?: string };
    };
    if (body.status === "done" && body.video?.url) {
      rec.videoUrl = body.video.url;
      moments.set(rec.id, rec);
      return { ok: true as const, moment: rec };
    }
    if (body.status === "failed" || body.status === "expired") {
      return {
        ok: false as const,
        error: body.error?.message ?? "Reel did not finish",
        moment: rec,
      };
    }
    return { ok: true as const, pending: true as const, moment: rec };
  });

export const getMoment = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const rec = moments.get(data.id);
    if (!rec) return { ok: false as const, error: "This moment has expired." };
    return { ok: true as const, moment: rec };
  });

export const proxyMedia = createServerFn({ method: "POST" })
  .validator((input: { url: string }) => input)
  .handler(async ({ data }) => {
    if (!data.url.startsWith("https://") && !data.url.startsWith("http://")) {
      return { ok: false as const, error: "Invalid media" };
    }
    const res = await fetch(data.url);
    if (!res.ok) return { ok: false as const, error: "Could not fetch media" };
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "application/octet-stream";
    return { ok: true as const, mime, b64: buf.toString("base64") };
  });
