import { useCallback, useEffect, useRef, useState } from "react";

export type CamError = "unsupported" | "blocked" | null;

const ATTEMPTS: MediaStreamConstraints[] = [
  {
    audio: false,
    video: {
      facingMode: { ideal: "user" },
      width: { ideal: 1280 },
      height: { ideal: 1710 },
    },
  },
  { audio: false, video: { facingMode: { ideal: "user" } } },
  { audio: false, video: true },
];

export function useBoothCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<CamError>(null);

  const attach = useCallback(() => {
    const el = videoRef.current;
    const stream = streamRef.current;
    if (!el || !stream) return;
    if (el.srcObject !== stream) el.srcObject = stream;
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute("playsinline", "true");
    el.setAttribute("autoplay", "true");
    const play = () => {
      void el.play().then(
        () => setLive(true),
        () => setLive(stream.getVideoTracks().some((t) => t.readyState === "live")),
      );
    };
    if (el.readyState >= 1) play();
    else el.onloadedmetadata = play;
  }, []);

  const start = useCallback(async () => {
    const existing = streamRef.current;
    if (existing?.getVideoTracks().some((t) => t.readyState === "live")) {
      attach();
      setError(null);
      setLive(true);
      return true;
    }
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("unsupported");
      setLive(false);
      return false;
    }
    setBusy(true);
    setError(null);
    for (const constraints of ATTEMPTS) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setBusy(false);
        attach();
        return true;
      } catch {
        /* try the next, looser, constraint set */
      }
    }
    setBusy(false);
    setLive(false);
    setError("blocked");
    return false;
  }, [attach]);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { videoRef, start, stop, attach, live, busy, error };
}
