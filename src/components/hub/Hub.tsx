import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Clapperboard, LineChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeafMark, Lockup } from "@/components/brand/Mark";
import { TemplateGrid } from "@/components/brand/TemplateGrid";
import { t } from "@/lib/copy";
import { useLang } from "@/lib/lang";
import { campaignTemplates, currentEvent } from "@/lib/events";
import { SEED, loadStats, reach, shareRate, type Stats } from "@/lib/stats";
import { useEffect, useState } from "react";

export function Hub() {
  const { lang, setLang, dir } = useLang();
  const event = currentEvent();
  const [stats, setStats] = useState<Stats>(SEED);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  return (
    <div dir={dir} className="min-h-dvh bg-forest-deep text-cream">
      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <LeafMark className="size-10" />
          <div>
            <p className="text-sm font-medium leading-none">{t(lang, "brand")}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-leaf">
              almeera marketing activations
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="h-10 rounded-full px-3 text-xs shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-cream)_18%,transparent)]"
        >
          {lang === "ar" ? "EN" : "عربي"}
        </button>
      </header>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-10 pt-2">
        <div className="relative min-h-[70vh] overflow-hidden rounded-2xl">
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
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest/80 to-forest/25" />
          <div className="relative grid min-h-[70vh] items-end gap-8 p-6 md:grid-cols-2 md:items-center md:p-12">
            <div className="flex flex-col gap-5">
              <Lockup className="h-24 w-24 rounded-full object-cover ring-1 ring-cream/20 md:h-28 md:w-28" />
              <p className="text-xs uppercase tracking-widest text-leaf">
                {t(lang, "live")} · {event.name[lang]}
              </p>
              <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
                {t(lang, "brand")}
              </h1>
              <p className="max-w-xl text-lg text-cream-dim md:text-xl">
                {t(lang, "tag")}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/booth">
                  <Button size="xl" className="w-full sm:w-auto">
                    <Sparkles className="size-4" />
                    {t(lang, "startMoment")}
                  </Button>
                </Link>
                <Link to="/why">
                  <Button variant="cream" size="xl" className="w-full sm:w-auto">
                    {t(lang, "why")}
                  </Button>
                </Link>
              </div>
            </div>
            <MomentStage />
          </div>
        </div>

        <DriftRibbon />

        <div className="mt-8 grid grid-cols-3 gap-3 md:gap-6">
          {[
            {
              k: stats.moments.toLocaleString(),
              v: lang === "ar" ? "لحظة (نموذج تشغيلي)" : "moments in the pilot model",
            },
            {
              k: `${shareRate(stats)}%`,
              v: lang === "ar" ? "نسبة المشاركة" : "share rate",
            },
            {
              k: `${Math.round(reach(stats) / 1000)}k`,
              v: lang === "ar" ? "وصول مقدّر" : "estimated reach",
            },
          ].map((s) => (
            <div key={s.v} className="rounded-xl bg-forest px-4 py-5 shadow-border">
              <p className="font-display text-2xl tabular-nums md:text-4xl">{s.k}</p>
              <p className="mt-1 text-xs text-muted md:text-sm">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-leaf">
                {t(lang, "brand")}
              </p>
              <h2 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">
                {t(lang, "createLook")}
              </h2>
              <p className="mt-1 text-sm text-muted">{t(lang, "pickTemplate")}</p>
            </div>
            <Link
              to="/campaign"
              className="flex shrink-0 items-center gap-1 text-sm text-leaf"
            >
              <LineChart className="size-4" />
              {t(lang, "desk")}
            </Link>
          </div>
          <TemplateGrid asLinks />
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <Link
            to="/booth"
            className="flex items-start gap-3 rounded-xl bg-forest p-5 shadow-border"
          >
            <Clapperboard className="mt-0.5 size-5 text-leaf" />
            <div>
              <p className="font-medium">
                {lang === "ar" ? "تجربة الضيف" : "Guest booth"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {lang === "ar"
                  ? "٣٠ ثانية. عربي أولاً. جاهز للكشك."
                  : "30 seconds. Arabic-first. Kiosk-ready."}
              </p>
            </div>
          </Link>
          <Link
            to="/why"
            className="flex items-start gap-3 rounded-xl bg-forest p-5 shadow-border"
          >
            <ArrowUpLeft className="mt-0.5 size-5 text-leaf" />
            <div>
              <p className="font-medium">
                {lang === "ar" ? "مذكرة التسويق" : "The marketing brief"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {lang === "ar"
                  ? "لماذا توافق الميرة على تشغيل هذا في الفروع."
                  : "Why almeera should run this in-store."}
              </p>
            </div>
          </Link>
          <Link
            to="/campaign"
            className="flex items-start gap-3 rounded-xl bg-forest p-5 shadow-border"
          >
            <LineChart className="mt-0.5 size-5 text-leaf" />
            <div>
              <p className="font-medium">{t(lang, "desk")}</p>
              <p className="mt-1 text-sm text-muted">
                {lang === "ar"
                  ? "وصول، وفا، وحقوق المحتوى — لحظة بلحظة."
                  : "Reach, wafa, and content rights — live."}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

function MomentStage() {
  const { lang } = useLang();
  const looks = campaignTemplates();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setI((n) => (n + 1) % looks.length),
      2800,
    );
    return () => window.clearInterval(id);
  }, [looks.length]);

  const current = looks[i]!;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink shadow-border">
        <img
          src="/moments/before.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        {looks.map((ev, idx) => (
          <img
            key={ev.id}
            src={ev.sample}
            alt=""
            className={
              idx === i
                ? "absolute inset-0 h-full w-full object-cover morph-in"
                : "pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
            }
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-4 pb-4 pt-12">
          <p className="text-xs uppercase tracking-widest text-leaf">
            {t(lang, "selfie")} → {current.name[lang]}
          </p>
          <p className="mt-1 text-lg font-medium">{t(lang, "brand")}</p>
        </div>
      </div>
    </div>
  );
}

function DriftRibbon() {
  const looks = [...campaignTemplates(), ...campaignTemplates()];
  return (
    <div className="drift-mask mt-6 overflow-hidden rounded-xl" aria-hidden>
      <div className="moment-drift">
        {looks.map((ev, i) => (
          <img
            key={`${ev.id}-${i}`}
            src={ev.sample}
            alt=""
            className="h-24 w-20 rounded-md object-cover md:h-28 md:w-24"
          />
        ))}
      </div>
    </div>
  );
}
