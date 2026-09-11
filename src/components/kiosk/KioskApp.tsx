import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Camera,
  ChevronLeft,
  ImagePlus,
  Loader2,
  QrCode,
  RefreshCw,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeafMark, Lockup } from "@/components/brand/Mark";
import { t } from "@/lib/copy";
import { useLang } from "@/lib/lang";
import {
  currentEvent,
  eventById,
  type EventDef,
  type LookId,
} from "@/lib/events";
import { frameToJpeg, fileToJpeg, urlToJpeg } from "@/lib/capture";
import { useBoothCamera } from "@/lib/camera";
import { createMoment, pollReel, proxyMedia, type MomentRecord } from "@/lib/generate";
import { bump } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { TemplateGrid } from "@/components/brand/TemplateGrid";

type Step = "attract" | "consent" | "camera" | "look" | "generate" | "reveal";

export function KioskApp() {
  const { lang, setLang, dir } = useLang();
  const [step, setStep] = useState<Step>("attract");
  const [event, setEvent] = useState<EventDef>(() => {
    if (typeof window === "undefined") return currentEvent();
    const id = new URLSearchParams(window.location.search).get("event");
    return id ? eventById(id) : currentEvent();
  });
  const [ugc, setUgc] = useState(true);
  const [shot, setShot] = useState<string | null>(null);
  const [look, setLook] = useState<LookId>("portrait");
  const [moment, setMoment] = useState<MomentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reelPending, setReelPending] = useState(false);
  const camera = useBoothCamera();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("cam") !== "1") return;
    setStep("camera");
    void camera.start();
    // start is stable enough for a one-shot deep link
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reset() {
    setStep("attract");
    setShot(null);
    setMoment(null);
    setError(null);
    setBusy(false);
    setReelPending(false);
    setLook("portrait");
  }

  async function generate(photo: string, format: LookId) {
    setBusy(true);
    setError(null);
    setStep("generate");
    const res = await createMoment({
      data: {
        imageDataUrl: photo,
        eventId: event.id,
        format,
        ugcConsent: ugc,
      },
    });
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      setStep("look");
      return;
    }
    setMoment(res.moment);
    bump("moments", event.id);
    if (ugc) bump("ugc");
    setBusy(false);
    setStep("reveal");
    if (res.moment.format === "reel" && res.moment.videoRequestId) {
      setReelPending(true);
    }
  }

  useEffect(() => {
    if (!reelPending || !moment?.id) return;
    let stop = false;
    const tick = async () => {
      const res = await pollReel({ data: { id: moment.id } });
      if (stop) return;
      if (res.ok && "moment" in res && res.moment.videoUrl) {
        setMoment(res.moment);
        setReelPending(false);
        return;
      }
      if (!res.ok) {
        setReelPending(false);
        setError(res.error);
        return;
      }
      window.setTimeout(tick, 3000);
    };
    const tmr = window.setTimeout(tick, 2500);
    return () => {
      stop = true;
      window.clearTimeout(tmr);
    };
  }, [reelPending, moment?.id]);

  return (
    <div dir={dir} className="relative min-h-dvh bg-forest-deep text-cream">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <LeafMark className="size-9" />
          <span className="text-sm font-medium tracking-tight">
            {t(lang, "brand")}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="h-10 rounded-full px-3 text-xs tracking-wide shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-cream)_18%,transparent)]"
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>
        </div>
      </header>

      {step === "attract" && (
        <Attract event={event} onStart={() => setStep("consent")} />
      )}
      {step === "consent" && (
        <Consent
          ugc={ugc}
          setUgc={setUgc}
          onBack={() => setStep("attract")}
          onNext={() => {
            void camera.start();
            setStep("camera");
          }}
        />
      )}
      {step === "camera" && (
        <Capture
          camera={camera}
          onBack={() => setStep("consent")}
          onShot={(data) => {
            setShot(data);
            setStep("look");
          }}
        />
      )}
      {step === "look" && shot && (
        <LookPick
          shot={shot}
          event={event}
          selected={look}
          error={error}
          onSelect={setLook}
          onPickEvent={(id) => setEvent(eventById(id))}
          onBack={() => setStep("camera")}
          onGo={(id) => {
            setLook(id);
            void generate(shot, id);
          }}
        />
      )}
      {step === "generate" && <Generating event={event} />}
      {step === "reveal" && moment && (
        <Reveal
          event={event}
          moment={moment}
          reelPending={reelPending}
          onNext={reset}
        />
      )}
    </div>
  );
}

function Attract({
  event,
  onStart,
}: {
  event: EventDef;
  onStart: () => void;
}) {
  const { lang } = useLang();
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden">
      <video
        className="ken absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/moments/aisle.jpg"
      >
        <source src="/moments/aisle.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-forest/20" />
      <div className="relative z-10 flex w-full flex-col gap-5 px-6 pb-10 pt-24">
        <Lockup className="h-28 w-28 rounded-full object-cover ring-1 ring-cream/20" />
        <p className="text-xs uppercase tracking-[0.22em] text-leaf">
          {t(lang, "live")} · {event.name[lang]}
        </p>
        <h1 className="rise font-display text-4xl font-medium leading-tight tracking-tight md:text-6xl">
          {t(lang, "brand")}
        </h1>
        <p className="max-w-md text-lg text-cream-dim">{event.line[lang]}</p>
        <Button size="xl" className="mt-2 w-full max-w-sm" onClick={onStart}>
          {t(lang, "startMoment")}
        </Button>
      </div>
    </section>
  );
}

function Consent({
  ugc,
  setUgc,
  onBack,
  onNext,
}: {
  ugc: boolean;
  setUgc: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { lang } = useLang();
  return (
    <section className="mx-auto flex min-h-dvh max-w-lg flex-col justify-end gap-6 px-6 pb-10 pt-24">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 self-start text-sm text-cream-dim"
      >
        <ChevronLeft className="size-4" />
        {lang === "ar" ? "رجوع" : "Back"}
      </button>
      <h2 className="text-3xl font-medium tracking-tight">{t(lang, "brand")}</h2>
      <p className="text-cream-dim leading-relaxed">{t(lang, "consent")}</p>
      <label className="flex items-start gap-3 rounded-xl bg-forest p-4 shadow-border">
        <input
          type="checkbox"
          checked={ugc}
          onChange={(e) => setUgc(e.target.checked)}
          className="mt-1 size-5 accent-leaf"
        />
        <span className="text-sm leading-relaxed">{t(lang, "ugc")}</span>
      </label>
      <Button size="xl" onClick={onNext}>
        {t(lang, "agree")}
      </Button>
    </section>
  );
}

function Capture({
  camera,
  onBack,
  onShot,
}: {
  camera: ReturnType<typeof useBoothCamera>;
  onBack: () => void;
  onShot: (data: string) => void;
}) {
  const { lang } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);
  const shotRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const { videoRef, start, attach, live, busy, error } = camera;

  useEffect(() => {
    attach();
  }, [attach, live]);

  function snap() {
    const v = videoRef.current;
    if (!v || !v.videoWidth) {
      void start();
      return;
    }
    setCount(3);
    let n = 3;
    const id = window.setInterval(() => {
      n -= 1;
      if (n <= 0) {
        window.clearInterval(id);
        setCount(null);
        const data = frameToJpeg(v);
        if (data) setPreview(data);
      } else setCount(n);
    }, 700);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    const data = await fileToJpeg(file);
    if (data) setPreview(data);
  }

  return (
    <section className="flex min-h-dvh flex-col pt-20">
      <div className="relative mx-4 aspect-[3/4] overflow-hidden rounded-2xl bg-ink">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full scale-x-[-1] object-cover"
          />
        )}
        {!preview && !live && (
          <div className="absolute inset-0 grid place-items-center bg-forest-deep/40 px-8 text-center">
            <p className="text-sm text-cream-dim">
              {busy
                ? lang === "ar"
                  ? "نطلب الكاميرا…"
                  : "Asking for the camera…"
                : t(lang, "enableCam")}
            </p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-8 rounded-full border border-cream/25" />
        {count !== null && (
          <div className="absolute inset-0 grid place-items-center bg-ink/40 text-7xl font-medium">
            {count}
          </div>
        )}
      </div>
      {error && !live && (
        <p className="px-6 pt-3 text-sm text-sand">{t(lang, "camBlocked")}</p>
      )}
      <div className="mt-auto flex flex-col gap-3 px-6 py-6">
        {preview ? (
          <>
            <Button size="xl" onClick={() => onShot(preview)}>
              {t(lang, "usePhoto")}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setPreview(null)}
            >
              {t(lang, "retake")}
            </Button>
          </>
        ) : live ? (
          <>
            <Button size="xl" onClick={snap}>
              <Camera className="size-5" />
              {t(lang, "capture")}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => fileRef.current?.click()}
              >
                <ImagePlus className="size-4" />
                {t(lang, "upload")}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={async () => {
                  const data = await urlToJpeg("/moments/before.jpg");
                  if (data) onShot(data);
                }}
              >
                {t(lang, "demo")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              size="xl"
              disabled={busy}
              onClick={async () => {
                const ok = await start();
                if (ok) return;
                if (window.self === window.top) return;
                window.open(
                  `${window.location.origin}/booth?cam=1`,
                  "meera-cam",
                  "width=420,height=860",
                );
              }}
            >
              <Camera className="size-5" />
              {t(lang, "enableCam")}
            </Button>
            <Button
              variant="cream"
              size="lg"
              onClick={() => shotRef.current?.click()}
            >
              {t(lang, "deviceCam")}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => fileRef.current?.click()}
              >
                <ImagePlus className="size-4" />
                {t(lang, "upload")}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={async () => {
                  const data = await urlToJpeg("/moments/before.jpg");
                  if (data) onShot(data);
                }}
              >
                {t(lang, "demo")}
              </Button>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={onBack}
          className="py-2 text-sm text-muted"
        >
          {lang === "ar" ? "رجوع" : "Back"}
        </button>
      </div>
      <input
        ref={shotRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </section>
  );
}

function LookPick({
  shot,
  event,
  selected,
  error,
  onSelect,
  onPickEvent,
  onBack,
  onGo,
}: {
  shot: string;
  event: EventDef;
  selected: LookId;
  error: string | null;
  onSelect: (id: LookId) => void;
  onPickEvent: (id: string) => void;
  onBack: () => void;
  onGo: (id: LookId) => void;
}) {
  const { lang } = useLang();
  const format = selected === "reel" ? "reel" : "portrait";
  return (
    <section className="mx-auto flex min-h-dvh max-w-lg flex-col gap-5 px-5 pb-10 pt-24">
      <div className="flex gap-4">
        <img
          src={shot}
          alt=""
          className="h-24 w-20 rounded-lg object-cover"
        />
        <div>
          <p className="text-xs uppercase tracking-widest text-leaf">
            {t(lang, "createLook")}
          </p>
          <h2 className="mt-1 text-2xl font-medium">{t(lang, "look")}</h2>
          <p className="mt-1 text-sm text-muted">{event.line[lang]}</p>
        </div>
      </div>
      <TemplateGrid selectedId={event.id} onSelect={onPickEvent} />
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelect("portrait")}
          className={cn(
            "rounded-xl px-4 py-3 text-sm shadow-border",
            format === "portrait" ? "bg-forest-mid" : "bg-forest",
          )}
        >
          {t(lang, "poster")}
        </button>
        <button
          type="button"
          onClick={() => onSelect("reel")}
          className={cn(
            "rounded-xl px-4 py-3 text-sm shadow-border",
            format === "reel" ? "bg-forest-mid" : "bg-forest",
          )}
        >
          {t(lang, "reelFmt")}
        </button>
      </div>
      {error && <p className="text-sm text-sand">{error}</p>}
      <Button size="xl" onClick={() => onGo(format)}>
        {t(lang, "makeMoment")}
      </Button>
      <button type="button" onClick={onBack} className="text-sm text-muted">
        {t(lang, "retake")}
      </button>
    </section>
  );
}

function Generating({ event }: { event: EventDef }) {
  const { lang } = useLang();
  return (
    <section className="relative flex min-h-dvh items-end overflow-hidden">
      <img
        src={event.sample}
        alt=""
        className="ken absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-forest-deep/70" />
      <div className="relative z-10 px-6 pb-16">
        <Loader2 className="mb-4 size-8 animate-spin text-leaf" />
        <p className="shimmer-text text-2xl font-medium">
          {t(lang, "generating")}
        </p>
        <p className="mt-2 max-w-sm text-cream-dim">{event.line[lang]}</p>
      </div>
    </section>
  );
}

function Reveal({
  event,
  moment,
  reelPending,
  onNext,
}: {
  event: EventDef;
  moment: MomentRecord;
  reelPending: boolean;
  onNext: () => void;
}) {
  const { lang } = useLang();
  const [qr, setQr] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${moment.id}`
      : "";

  useEffect(() => {
    let live = true;
    import("qrcode").then(async (mod) => {
      const QR = mod.default;
      const url = await QR.toDataURL(shareUrl, {
        margin: 1,
        width: 280,
        color: { dark: "#12201a", light: "#f3efe3" },
      });
      if (live) setQr(url);
    });
    return () => {
      live = false;
    };
  }, [shareUrl]);

  async function save() {
    bump("shares");
    const url = moment.videoUrl ?? moment.imageUrl;
    const proxied = url.startsWith("http")
      ? await proxyMedia({ data: { url } })
      : null;
    const href =
      proxied && proxied.ok
        ? `data:${proxied.mime};base64,${proxied.b64}`
        : url;
    const a = document.createElement("a");
    a.href = href;
    a.download = moment.videoUrl ? "meera-moment.mp4" : "meera-moment.jpg";
    a.click();
  }

  async function nativeShare() {
    bump("shares");
    const text = `${event.name[lang]} · ${event.hashtag}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: t(lang, "brand"), text, url: shareUrl });
        return;
      } catch {
        /* fall through */
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
      "_blank",
    );
  }

  return (
    <section className="mx-auto flex min-h-dvh max-w-lg flex-col pb-8 pt-20">
      <div className="relative mx-4 overflow-hidden rounded-2xl bg-ink">
        {moment.videoUrl ? (
          <>
            <video
              src={moment.videoUrl}
              className="w-full"
              autoPlay
              loop
              playsInline
              muted={muted}
            />
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="absolute bottom-3 end-3 grid size-10 place-items-center rounded-full bg-ink/70"
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          </>
        ) : (
          <img src={moment.imageUrl} alt="" className="w-full object-cover" />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-4">
          <div className="flex items-center gap-2">
            <LeafMark className="size-8" />
            <span className="text-xs">{event.hashtag}</span>
          </div>
        </div>
        {reelPending && (
          <div className="absolute inset-x-0 top-0 bg-forest/80 px-4 py-2 text-center text-xs">
            {lang === "ar"
              ? "صورتك جاهزة — الريل يُصاغ الآن"
              : "Portrait ready — your reel is still developing"}
          </div>
        )}
      </div>
      <div className="mt-5 px-6">
        <p className="text-xs uppercase tracking-[0.18em] text-leaf">
          {event.name[lang]}
        </p>
        <h2 className="mt-1 text-2xl font-medium">{t(lang, "reveal")}</h2>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 px-6">
        <Button variant="cream" size="md" onClick={() => void save()}>
          {t(lang, "save")}
        </Button>
        <Button size="md" onClick={() => void nativeShare()}>
          <Share2 className="size-4" />
          {t(lang, "share")}
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            bump("shares");
            bump("wafa");
            window.open(
              `https://wa.me/?text=${encodeURIComponent(`${event.hashtag} ${shareUrl}`)}`,
              "_blank",
            );
          }}
        >
          {t(lang, "whatsapp")}
        </Button>
      </div>
      <div className="mx-6 mt-6 flex items-center gap-4 rounded-xl bg-forest p-4 shadow-border">
        {qr ? (
          <img src={qr} alt="" className="size-24 rounded-md outline-none" />
        ) : (
          <QrCode className="size-16 text-muted" />
        )}
        <p className="text-sm text-cream-dim">{t(lang, "qr")}</p>
      </div>
      <div className="mt-6 px-6">
        <Button variant="ghost" size="lg" className="w-full" onClick={onNext}>
          <RefreshCw className="size-4" />
          {t(lang, "next")}
        </Button>
      </div>
    </section>
  );
}


