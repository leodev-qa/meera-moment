import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/Mark";
import { getMoment, proxyMedia, type MomentRecord } from "@/lib/generate";
import { eventById } from "@/lib/events";
import { bump } from "@/lib/stats";
import { useLang } from "@/lib/lang";
import { t } from "@/lib/copy";

export function ShareView({ id }: { id: string }) {
  const { lang, setLang, dir } = useLang();
  const [moment, setMoment] = useState<MomentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMoment({ data: { id } }).then((res) => {
      if (res.ok) setMoment(res.moment);
      else setError(res.error);
    });
  }, [id]);

  const event = moment ? eventById(moment.eventId) : null;

  async function save() {
    if (!moment) return;
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

  return (
    <div dir={dir} className="mx-auto flex min-h-dvh max-w-md flex-col bg-forest-deep px-5 pb-10 pt-6 text-cream">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <LeafMark className="size-9" />
          <span className="text-sm">{t(lang, "brand")}</span>
        </Link>
        <button
          type="button"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="h-10 rounded-full px-3 text-xs shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-cream)_18%,transparent)]"
        >
          {lang === "ar" ? "EN" : "عربي"}
        </button>
      </div>
      {error && <p className="mt-16 text-center text-sand">{error}</p>}
      {moment && event && (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl">
            {moment.videoUrl ? (
              <video src={moment.videoUrl} className="w-full" controls playsInline />
            ) : (
              <img src={moment.imageUrl} alt="" className="w-full" />
            )}
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-leaf">
            {event.name[lang]}
          </p>
          <h1 className="mt-1 text-2xl font-medium">{t(lang, "reveal")}</h1>
          <p className="mt-1 text-sm text-muted">{event.hashtag}</p>
          <Button size="xl" className="mt-6" onClick={() => void save()}>
            {t(lang, "save")}
          </Button>
          <a
            className="mt-3"
            href={`https://wa.me/?text=${encodeURIComponent(`${event.hashtag} ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
          >
            <Button variant="ghost" size="lg" className="w-full">
              {t(lang, "whatsapp")}
            </Button>
          </a>
        </>
      )}
    </div>
  );
}
