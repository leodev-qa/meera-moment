import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/Mark";
import { t } from "@/lib/copy";
import { useLang } from "@/lib/lang";
import {
  EVENTS,
  currentEvent,
  getForcedEventId,
  setForcedEventId,
} from "@/lib/events";
import { SEED, loadStats, reach, shareRate, type Stats } from "@/lib/stats";

const PIN = "2655";

const HOURS = [
  { h: "10", n: 42 },
  { h: "11", n: 67 },
  { h: "12", n: 91 },
  { h: "13", n: 74 },
  { h: "16", n: 88 },
  { h: "17", n: 121 },
  { h: "18", n: 156 },
  { h: "19", n: 143 },
  { h: "20", n: 98 },
  { h: "21", n: 54 },
];

const BRANCHES = [
  { ar: "عين خالد", en: "Ain Khaled", n: 312 },
  { ar: "المنصورة", en: "Mansoura", n: 274 },
  { ar: "الهلال", en: "Airport Hyper", n: 241 },
  { ar: "الوكرة", en: "Wakra", n: 198 },
  { ar: "الهتمي", en: "Hyatt Plaza", n: 176 },
];

export function Desk() {
  const { lang, setLang, dir } = useLang();
  const [pin, setPin] = useState("");
  const [open, setOpen] = useState(false);
  const [forced, setForced] = useState<string | null>(() => getForcedEventId());
  const [stats, setStats] = useState<Stats>(SEED);
  const live = currentEvent();

  useEffect(() => {
    setStats(loadStats());
  }, [open]);

  if (!open) {
    return (
      <div dir={dir} className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-5 px-6">
        <LeafMark className="size-12" />
        <h1 className="text-2xl font-medium">{t(lang, "desk")}</h1>
        <p className="text-sm text-muted">
          {lang === "ar" ? "رمز تجريبي للعروض: ٢٦٥٥" : "Demo PIN for presentations: 2655"}
        </p>
        <input
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="h-14 rounded-lg bg-forest px-4 text-lg tracking-[0.4em] text-cream shadow-border outline-none"
          placeholder="••••"
        />
        <Button
          size="xl"
          onClick={() => {
            if (pin === PIN) setOpen(true);
          }}
        >
          {t(lang, "unlock")}
        </Button>
        <Link to="/" className="text-center text-sm text-muted">
          {lang === "ar" ? "العودة" : "Back"}
        </Link>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-dvh bg-forest-deep text-cream">
      <header className="flex items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <LeafMark className="size-9" />
          <span className="text-sm">{t(lang, "desk")}</span>
        </Link>
        <button
          type="button"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="h-10 rounded-full px-3 text-xs shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-cream)_18%,transparent)]"
        >
          {lang === "ar" ? "EN" : "عربي"}
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-leaf">
          {t(lang, "live")} · {live.name[lang]}
        </p>
        <h1 className="mt-2 text-3xl font-medium">
          {lang === "ar" ? "غرفة عمليات التفعيل" : "Activation command"}
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { k: stats.moments.toLocaleString(), v: lang === "ar" ? "لحظات" : "Moments" },
            { k: `${shareRate(stats)}%`, v: lang === "ar" ? "مشاركة" : "Share rate" },
            {
              k: `${Math.round(reach(stats) / 1000)}k`,
              v: lang === "ar" ? "وصول" : "Est. reach",
            },
            { k: stats.wafa.toLocaleString(), v: lang === "ar" ? "مسح وفا" : "wafa scans" },
          ].map((s) => (
            <div key={s.v} className="rounded-xl bg-forest px-4 py-5 shadow-border">
              <p className="font-display text-2xl tabular-nums md:text-3xl">{s.k}</p>
              <p className="mt-1 text-xs text-muted">{s.v}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-xl bg-forest p-5 shadow-border">
          <h2 className="mb-4 text-sm text-muted">
            {lang === "ar" ? "الذروة خلال اليوم" : "In-store peak hours"}
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURS}>
                <XAxis dataKey="h" stroke="#8a9a90" fontSize={12} />
                <YAxis stroke="#8a9a90" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#0c3326",
                    border: "1px solid #8fcb3f33",
                    color: "#f3efe3",
                  }}
                />
                <Bar dataKey="n" fill="#8fcb3f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-forest p-5 shadow-border">
            <h2 className="text-sm text-muted">
              {lang === "ar" ? "الفروع المتصدرة" : "Leading branches"}
            </h2>
            <ul className="mt-4 space-y-3">
              {BRANCHES.map((b) => (
                <li key={b.en} className="flex items-center justify-between">
                  <span>{b[lang]}</span>
                  <span className="tabular-nums text-leaf">{b.n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-forest p-5 shadow-border">
            <h2 className="text-sm text-muted">
              {lang === "ar" ? "فرض الحدث للكشك" : "Force booth event"}
            </h2>
            <div className="mt-4 grid gap-2">
              {EVENTS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    const next = e.id === "everyday" ? null : e.id;
                    setForcedEventId(forced === e.id ? null : next);
                    setForced(getForcedEventId());
                  }}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-start text-sm shadow-border"
                >
                  <span>{e.name[lang]}</span>
                  {forced === e.id && <span className="text-leaf">live</span>}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-sm text-muted">
            {lang === "ar" ? "حائط اللحظات" : "Moment wall"}
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
            {[
              "/moments/after-national.jpg",
              "/moments/after-falcon.jpg",
              "/moments/after-f1.jpg",
              "/moments/family.jpg",
              "/moments/green.jpg",
              "/moments/mango.jpg",
            ].map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="aspect-[3/4] rounded-lg object-cover"
              />
            ))}
          </div>
        </section>

        <p className="mt-8 text-sm text-muted">
          {lang === "ar"
            ? `${stats.ugc} لحظة بحقوق إعادة النشر — جاهزة لإنستغرام الميرة.`
            : `${stats.ugc} moments with reshare rights — ready for almeera Instagram.`}
        </p>
      </main>
    </div>
  );
}
