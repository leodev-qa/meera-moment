import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/Mark";
import { t } from "@/lib/copy";
import { useLang } from "@/lib/lang";
import { EVENTS, currentEvent } from "@/lib/events";
import { useState } from "react";

const BENEFITS = [
  {
    ar: "المتسوق هو النجم",
    en: "The shopper is the talent",
    arBody:
      "بدل فيلم واحد بممثل مستأجر، كل زبون يخرج بمحتوى سينمائي عن نفسه — وهذا ما يُنشر فعلاً.",
    enBody:
      "Instead of one hired face, every guest leaves with cinematic content of themselves — the only kind people actually post.",
  },
  {
    ar: "إعلام غير مدفوع على واتساب",
    en: "Unpaid media on WhatsApp",
    arBody:
      "في قطر تُعاد الصور العائلية في المجموعات. كل ريل هو إعلان في أجحم دائرة ثقة.",
    enBody:
      "In Qatar, family groups are the real network. Each reel is an ad inside the most trusted circle.",
  },
  {
    ar: "تقويم سنة كاملة، كشك واحد",
    en: "One booth, a full year of campaigns",
    arBody:
      "سهيل، العودة للمدارس، الاستدامة، فيفا، فورمولا 1، اليوم الوطني، رمضان، العيد — الكشك يبدّل الثيم تلقائياً.",
    enBody:
      "S'hail, back to school, sustainability, FIFA, F1, National Day, Ramadan, Eid — the booth switches theme by itself.",
  },
  {
    ar: "اكتساب وفا على كل حفظ",
    en: "wafa on every save",
    arBody:
      "رمز الاستجابة يفتح اللحظة… وصفحة الانضمام لـ وفا. تكلفة اكتساب أقل من أي حملة رقمية.",
    enBody:
      "The QR that saves the portrait can land on a wafa join. Acquisition cost drops below any paid digital burst.",
  },
  {
    ar: "مكتبة محتوى بحقوق جاهزة",
    en: "A rights-ready UGC library",
    arBody:
      "من يوافق، تُعيد الميرة نشر لحظته على إنستغرام وX. محتوى أصيل يومياً بلا تكلفة مؤثر.",
    enBody:
      "Guests who opt in let almeera reshare. Daily authentic content, no influencer invoice.",
  },
  {
    ar: "٦٥ فرعاً بنفس الجودة",
    en: "65 branches, identical craft",
    arBody:
      "عين خالد أو الوكرة — نفس الإخراج السينمائي. حملة وطنية بجودة جناح كتارا.",
    enBody:
      "Ain Khaled or Wakra — the same cinematic grade. National craft, neighbourhood footprint.",
  },
  {
    ar: "جناح درب الساعي جاهز",
    en: "Darb Al Saai pavilion-ready",
    arBody:
      "اليوم الوطني يحتاج تجربة تُذكر. هذا الكشك هو الجناح: الناس يقفون، يصوّرون، يشاركون، ويعودون للفرع.",
    enBody:
      "National Day needs a destination. This booth is the pavilion: people queue, post, and walk back into the store.",
  },
  {
    ar: "أرقام تُعرض على الإدارة",
    en: "Numbers a CMO can take upstairs",
    arBody:
      "لحظات، نسبة مشاركة، وصول مقدّر، ساعات الذروة، وأي فرع يتصدّر — في غرفة حملة واحدة.",
    enBody:
      "Moments, share rate, estimated reach, peak hours, winning branches — one campaign desk.",
  },
];

const COST = [
  {
    ar: "تلفزيون / فيلم علامة",
    en: "Brand film / TVC",
    arN: "٨٠–١٥٠ ألف ر.ق",
    enN: "QAR 80–150k",
    arS: "وجه واحد، أسبوع واحد",
    enS: "One face, one week",
  },
  {
    ar: "مؤثر لكل منشور",
    en: "Influencer post",
    arN: "٥–١٥ ألف ر.ق",
    enN: "QAR 5–15k",
    arS: "جمهور مستأجر",
    enS: "Rented audience",
  },
  {
    ar: "لحظة الميرة",
    en: "Meera Moment",
    arN: "كشك + تفعيل",
    enN: "One booth + Imagine",
    arS: "آلاف الوجوه، كلّها أصيلة",
    enS: "Thousands of real faces",
  },
];

export function Why() {
  const { lang, setLang, dir } = useLang();
  const event = currentEvent();
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div dir={dir} className="min-h-dvh bg-forest-deep text-cream">
      <header className="flex items-center justify-between px-5 py-4">
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
      </header>

      <article className="mx-auto max-w-3xl px-5 pb-20">
        <p className="text-xs uppercase tracking-[0.22em] text-leaf">
          {lang === "ar" ? "مذكرة للتسويق" : "A note for marketing"}
        </p>
        <h1 className="mt-3 text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          {lang === "ar"
            ? "لماذا توافق الميرة على هذا التفعيل"
            : "Why almeera should say yes"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-cream-dim">
          {lang === "ar"
            ? "التفعيلات التقليدية تُلتقط وتُنسى. الناس لا ينشرون كيس هدايا. ينشرون أنفسهم — إذا كانت الصورة تستحق قصة إنستغرام."
            : "Traditional activations get photographed and forgotten. Nobody posts a free tote. They post themselves — if the picture is worth an Instagram story."}
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-medium">
            {lang === "ar" ? "الدليل من وجه واحد" : "Proof, from one face"}
          </h2>
          <p className="mt-2 text-cream-dim">
            {lang === "ar"
              ? "سيلفي عادي من الممر. بعد ثوانٍ: ملصق اليوم الوطني، أو سهيل، أو ليلة لوسيل. نفس الشخص. هذا ما يجعل المشاركة غريزية."
              : "An ordinary aisle selfie. Seconds later: National Day poster, S'hail, or Lusail night. Same person. That is why people share."}
          </p>
          <div className="relative mt-6 overflow-hidden rounded-2xl">
            <img
              src={showAfter ? "/moments/after-national.jpg" : "/moments/before.jpg"}
              alt=""
              className="aspect-[3/4] w-full object-cover md:aspect-[4/5]"
            />
            <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-ink/80 p-4">
              <Button
                size="pill"
                variant={showAfter ? "ghost" : "cream"}
                onClick={() => setShowAfter(false)}
              >
                {lang === "ar" ? "قبل" : "Before"}
              </Button>
              <Button
                size="pill"
                variant={showAfter ? "primary" : "ghost"}
                onClick={() => setShowAfter(true)}
              >
                {lang === "ar" ? "بعد" : "After"}
              </Button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              "/moments/after-national.jpg",
              "/moments/after-falcon.jpg",
              "/moments/after-f1.jpg",
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

        <section className="mt-14">
          <h2 className="text-2xl font-medium">
            {lang === "ar" ? "ما الذي تربحه الميرة" : "What almeera gains"}
          </h2>
          <div className="mt-6 grid gap-4">
            {BENEFITS.map((b) => (
              <div key={b.en} className="rounded-xl bg-forest p-5 shadow-border">
                <h3 className="font-medium">{b[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                  {lang === "ar" ? b.arBody : b.enBody}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-medium">
            {lang === "ar" ? "مقابل التكلفة المعتادة" : "Against the usual spend"}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {COST.map((c) => (
              <div key={c.en} className="rounded-xl bg-forest p-5 shadow-border">
                <p className="text-sm text-muted">{c[lang]}</p>
                <p className="mt-2 text-xl font-medium">
                  {lang === "ar" ? c.arN : c.enN}
                </p>
                <p className="mt-1 text-sm text-cream-dim">
                  {lang === "ar" ? c.arS : c.enS}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-medium">
            {lang === "ar" ? "تقويم التفعيل" : "The activation calendar"}
          </h2>
          <p className="mt-2 text-cream-dim">
            {lang === "ar"
              ? `الآن: ${event.name.ar}. الكشك لا يُعاد بناؤه — يتبدّل.`
              : `Live now: ${event.name.en}. The booth is not rebuilt. It retunes.`}
          </p>
          <ul className="mt-5 divide-y divide-cream/10">
            {EVENTS.filter((e) => e.id !== "everyday").map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3">
                <span>
                  <span className="block font-medium">{e.name[lang]}</span>
                  <span className="text-xs text-muted">{e.hashtag}</span>
                </span>
                <span className="text-sm tabular-nums text-cream-dim">
                  {e.start.slice(5)} – {e.end.slice(5)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-2xl bg-forest p-6 shadow-border">
          <h2 className="text-2xl font-medium">
            {lang === "ar" ? "الخصوصية والسلامة" : "Privacy and brand safety"}
          </h2>
          <p className="mt-3 leading-relaxed text-cream-dim">
            {lang === "ar"
              ? "لا قاعدة بيانات للوجوه. الصورة تُستخدم لهذه اللحظة فقط ما لم يوافق الضيف على إعادة النشر. القوالب عائلية، مناسبة للسوبرماركت، ومصممة لتفادي الرموز الرسمية والرخص."
              : "No face database. The photo is used for this souvenir unless the guest opts in to reshare. Templates are family-safe, supermarket-safe, and written to avoid official marks and licences."}
          </p>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link to="/booth">
            <Button size="xl" className="w-full">
              {t(lang, "startBooth")}
            </Button>
          </Link>
          <Link to="/campaign">
            <Button variant="ghost" size="xl" className="w-full">
              {t(lang, "desk")}
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
