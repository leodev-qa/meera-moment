export type LookId = "portrait" | "cover" | "reel";

export type EventDef = {
  id: string;
  priority: number;
  start: string;
  end: string;
  sample: string;
  afterSample?: string;
  hashtag: string;
  name: { ar: string; en: string };
  line: { ar: string; en: string };
  portraitPrompt: string;
  coverPrompt: string;
  reelPrompt: string;
};

const KEEP =
  "Keep the exact person or people from the reference photo: same faces, ages, skin tones, hair, number of people, and likeness. Do not add or remove anyone. Photoreal, 85mm editorial, cinematic lighting, shallow depth of field. No text, no watermark, no logos, no extra people, family-safe supermarket campaign still.";

export const EVENTS: EventDef[] = [
  {
    id: "shail",
    priority: 95,
    start: "2026-09-08",
    end: "2026-09-12",
    sample: "/moments/after-falcon.jpg",
    afterSample: "/moments/after-falcon.jpg",
    hashtag: "#MeeraMoment #SHail2026",
    name: { ar: "سهيل", en: "S'hail" },
    line: {
      ar: "تراث الصقارة… وأنت في الصورة.",
      en: "Falconry heritage, with you in the frame.",
    },
    portraitPrompt: `${KEEP} Restyle into a prestige Qatari hunting portrait: muted sage cloak, a hooded falcon on a leather glove, desert dawn, wind in fabric, golden rim light, quiet pride.`,
    coverPrompt: `${KEEP} Fashion-heritage magazine cover energy: the guest as a modern falconer at first light, desert and sadu textures softly behind, rich earth tones, Vogue Arabia still, no masthead text.`,
    reelPrompt:
      "The guest holds a calm pose as desert wind moves the cloak, the falcon shifts on the glove, sun flare blooms, slow cinematic push-in, 6 seconds, natural motion, no text.",
  },
  {
    id: "school",
    priority: 70,
    start: "2026-08-15",
    end: "2026-09-30",
    sample: "/moments/after-school.jpg",
    hashtag: "#MeeraMoment #BackToSchool",
    name: { ar: "العودة إلى المدارس", en: "Back to School" },
    line: {
      ar: "بداية العام… لحظة العائلة.",
      en: "The school-run, turned into a family portrait.",
    },
    portraitPrompt: `${KEEP} Warm family-commercial portrait in a sunlit almeera-style aisle of school supplies and fresh fruit, hopeful, contemporary Qatar, natural window light.`,
    coverPrompt: `${KEEP} Editorial back-to-school campaign still: crisp styling, paper bags and pencils as quiet props, cream and leaf-green grade, no text.`,
    reelPrompt:
      "A gentle smile, a paper bag shifts, sunlight moves across the face, slow push-in, 6 seconds, no text.",
  },
  {
    id: "anniversary",
    priority: 80,
    start: "2026-09-26",
    end: "2026-11-02",
    sample: "/moments/after-anniversary.jpg",
    hashtag: "#MeeraMoment #almeera",
    name: { ar: "مهرجان الميرة", en: "Anniversary Festival" },
    line: {
      ar: "كل بيت يتسوق في الميرة. كل وجه حملة.",
      en: "Everybody shops at almeera. Every face is the campaign.",
    },
    portraitPrompt: `${KEEP} Celebratory but refined supermarket-festival portrait: cream and leaf-green styling, soft bokeh lights, proud everyday glamour, not carnival-cheap.`,
    coverPrompt: `${KEEP} Premium campaign cover: the guest as the face of almeera's anniversary, cinematic grocery light, lime accents, no text.`,
    reelPrompt:
      "Soft festival lights drift, the guest turns slightly to camera, fabric and light move, 6 seconds, no text.",
  },
  {
    id: "sustain",
    priority: 75,
    start: "2026-10-31",
    end: "2026-11-18",
    sample: "/moments/after-sustain.jpg",
    hashtag: "#MeeraMoment #BaggingABetterTomorrow",
    name: { ar: "غدٍ أفضل", en: "Bagging a Better Tomorrow" },
    line: {
      ar: "كيس اليوم، صورة تُحفظ.",
      en: "A reusable bag, and a portrait worth posting.",
    },
    portraitPrompt: `${KEEP} Contemporary eco-campaign portrait: kraft paper grocery bag, plants, sunlit doorway, hopeful, natural, premium NGO-meets-retail still.`,
    coverPrompt: `${KEEP} Clean editorial sustainability cover: greens, paper bag, linen, window light, no text.`,
    reelPrompt:
      "Leaves stir, the paper bag rustles, the guest breathes and smiles, slow push-in, 6 seconds, no text.",
  },
  {
    id: "u17",
    priority: 88,
    start: "2026-11-19",
    end: "2026-12-13",
    sample: "/moments/after-u17.jpg",
    hashtag: "#MeeraMoment #FIFAU17",
    name: { ar: "كأس العالم للناشئين", en: "FIFA U-17 World Cup" },
    line: {
      ar: "قطر الملعب. أنت النجم.",
      en: "Qatar is the stadium. You are the star.",
    },
    portraitPrompt: `${KEEP} Night stadium hero portrait: maroon and white accents, floodlights, football bokeh, proud cinematic sports editorial, family-safe, no team crests.`,
    coverPrompt: `${KEEP} Sports-magazine cover energy under Lusail/Khalifa-style lights, maroon grade, the guest as the poster, no text, no official marks.`,
    reelPrompt:
      "Floodlights bloom, a slow proud turn, crowd bokeh pulses, 6 seconds, no text.",
  },
  {
    id: "f1",
    priority: 90,
    start: "2026-11-27",
    end: "2026-11-29",
    sample: "/moments/after-f1.jpg",
    afterSample: "/moments/after-f1.jpg",
    hashtag: "#MeeraMoment #QatarGP",
    name: { ar: "جائزة قطر الكبرى", en: "Qatar Grand Prix" },
    line: {
      ar: "ليلة لوسيل… بإطلالتك.",
      en: "Lusail night. Your paddock portrait.",
    },
    portraitPrompt: `${KEEP} Night race paddock portrait: tailored dark shirt, Lusail floodlights, motion-blurred cars far behind, cool highlights, magazine-cover energy.`,
    coverPrompt: `${KEEP} Formula paddock cover still: black wardrobe, visor glint somewhere in bokeh, cinematic night, no text, no team logos.`,
    reelPrompt:
      "Cars streak in the distance, lights flare, the guest holds a still paddock pose as the camera slowly pushes in, 6 seconds, no text.",
  },
  {
    id: "national",
    priority: 100,
    start: "2026-12-11",
    end: "2026-12-24",
    sample: "/moments/after-national.jpg",
    afterSample: "/moments/after-national.jpg",
    hashtag: "#MeeraMoment #ILoveQatar #QND",
    name: { ar: "اليوم الوطني", en: "Qatar National Day" },
    line: {
      ar: "أحبك يا قطر — وصورتك هي الملصق.",
      en: "I Love Qatar — and you are the poster.",
    },
    portraitPrompt: `${KEEP} Qatar National Day cinematic portrait: refined maroon and cream, subtle embroidery, dusk at a sandy festival ground like Darb Al Saai, flags softly blurred, rim light, Vogue Arabia, quiet pride.`,
    coverPrompt: `${KEEP} National Day magazine cover still: maroon bisht or embroidered cream, fireworks bokeh, horses far in the dust, heroic but intimate, no text, no official emblems.`,
    reelPrompt:
      "Maroon fabric catches wind, flags ripple, fireworks bloom softly in the dusk sky, the guest turns toward camera with quiet pride, 6 seconds, no text.",
  },
  {
    id: "everyday",
    priority: 10,
    start: "2026-01-01",
    end: "2026-12-31",
    sample: "/moments/after-everyday.jpg",
    hashtag: "#MeeraMoment #almeera",
    name: { ar: "كل يوم الميرة", en: "Everyday almeera" },
    line: {
      ar: "تسوقك اليومي… يصبح صورة تُشارك.",
      en: "The weekly shop, turned into a portrait people post.",
    },
    portraitPrompt: `${KEEP} Luxury food-commercial portrait in a sunlit produce aisle: mangoes and greens glistening, warm mist, forest-green grade, the guest as the face of freshness.`,
    coverPrompt: `${KEEP} Premium grocery campaign cover: cream and leaf, produce bokeh, editorial, no text.`,
    reelPrompt:
      "Produce glistens, a fine mist drifts, the guest smiles as the camera pushes in, 6 seconds, no text.",
  },
];

export function todayISO(d = new Date()) {
  const tz = 3 * 60;
  const q = new Date(d.getTime() + (tz + d.getTimezoneOffset()) * 60_000);
  return q.toISOString().slice(0, 10);
}

export function isActive(ev: EventDef, day = todayISO()) {
  return day >= ev.start && day <= ev.end;
}

export function activeEvent(day = todayISO()) {
  const live = EVENTS.filter((e) => isActive(e, day)).sort(
    (a, b) => b.priority - a.priority,
  );
  return live[0] ?? EVENTS.find((e) => e.id === "everyday")!;
}

export function upcomingEvents(day = todayISO()) {
  return EVENTS.filter((e) => e.end >= day && e.id !== "everyday").sort((a, b) =>
    a.start.localeCompare(b.start),
  );
}

export function eventById(id: string) {
  return EVENTS.find((e) => e.id === id) ?? activeEvent();
}

export function getForcedEventId() {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("meera-event-id");
}

export function setForcedEventId(id: string | null) {
  if (id) localStorage.setItem("meera-event-id", id);
  else localStorage.removeItem("meera-event-id");
}

export function currentEvent() {
  const forced = getForcedEventId();
  if (forced) return eventById(forced);
  return activeEvent();
}

export const TEMPLATE_ORDER = [
  "national",
  "shail",
  "f1",
  "u17",
  "school",
  "anniversary",
  "sustain",
  "everyday",
] as const;

export function campaignTemplates() {
  return TEMPLATE_ORDER.map((id) => eventById(id));
}

export const LOOKS: {
  id: LookId;
  name: { ar: string; en: string };
  hint: { ar: string; en: string };
}[] = [
  {
    id: "portrait",
    name: { ar: "صورة البطل", en: "Hero still" },
    hint: { ar: "لمشاركة إنستغرام", en: "Feed-ready 4:5" },
  },
  {
    id: "cover",
    name: { ar: "غلاف مجلة", en: "Magazine cover" },
    hint: { ar: "إطلالة أرشيفية", en: "The one they save" },
  },
  {
    id: "reel",
    name: { ar: "ريل سينمائي", en: "Cinematic reel" },
    hint: { ar: "٦ ثوانٍ تُعاد", en: "6 seconds they replay" },
  },
];
