export type Lang = "ar" | "en";

export const STR = {
  brand: { ar: "لحظة الميرة", en: "Meera Moment" },
  tag: {
    ar: "كل متسوّق… وجه الحملة.",
    en: "Every shopper becomes the campaign.",
  },
  startBooth: { ar: "افتح الكشك", en: "Open the booth" },
  startMoment: { ar: "ابدأ لحظتك", en: "Start your moment" },
  why: { ar: "لماذا الميرة", en: "The case for almeera" },
  desk: { ar: "غرفة الحملة", en: "Campaign desk" },
  agree: { ar: "أوافق وأصوّر", en: "Agree and capture" },
  consent: {
    ar: "نستخدم صورتك لهذه الذكرى فقط. لا نحفظ الوجوه في قاعدة بيانات. يمكنك منح الميرة حق إعادة النشر إن رغبت.",
    en: "Your photo is used only to make this souvenir. We do not keep a face database. You can let almeera reshare it if you wish.",
  },
  ugc: {
    ar: "اسمحوا للميرة بإعادة نشر لحظتي (بدون اسم)",
    en: "Allow almeera to reshare my moment (no name)",
  },
  capture: { ar: "تصوير", en: "Capture" },
  enableCam: { ar: "تشغيل الكاميرا", en: "Enable camera" },
  deviceCam: { ar: "التقط صورة", en: "Take a photo" },
  camBlocked: {
    ar: "اسمحوا للكاميرا عندما يطلب المتصفح ذلك. إن لم تظهر، التقطوا صورة من الجهاز.",
    en: "Allow the camera when the browser asks. If it stays dark, take a photo with the device.",
  },
  retake: { ar: "إعادة", en: "Retake" },
  usePhoto: { ar: "استخدم الصورة", en: "Use this photo" },
  upload: { ar: "رفع صورة", en: "Upload a photo" },
  demo: { ar: "تجربة بصورة نموذجية", en: "Try a demo guest" },
  look: { ar: "اختر إطلالتك", en: "Choose your look" },
  createLook: {
    ar: "اصنع لحظة الميرة",
    en: "Create a Meera Moment",
  },
  pickTemplate: {
    ar: "قوالب الحملات — اضغط لتبدأ",
    en: "Campaign looks — tap to begin",
  },
  poster: { ar: "ملصق", en: "Poster" },
  reelFmt: { ar: "ريل", en: "Reel" },
  selfie: { ar: "سيلفي الممر", en: "Aisle selfie" },
  becomes: { ar: "تصبح", en: "becomes" },
  makeMoment: { ar: "اصنع اللحظة", en: "Make my moment" },
  generating: {
    ar: "الميرة تصنع لحظتك…",
    en: "almeera is creating your moment…",
  },
  reveal: { ar: "لحظتك جاهزة", en: "Your moment is ready" },
  save: { ar: "حفظ", en: "Save" },
  share: { ar: "مشاركة", en: "Share" },
  whatsapp: { ar: "واتساب", en: "WhatsApp" },
  next: { ar: "الضيف التالي", en: "Next guest" },
  qr: { ar: "امسح لتحفظ على جوالك", en: "Scan to save on your phone" },
  live: { ar: "الحدث الحالي", en: "Live event" },
  pin: { ar: "رمز الكشك", en: "Booth PIN" },
  unlock: { ar: "دخول", en: "Unlock" },
} as const;

export function t(lang: Lang, key: keyof typeof STR) {
  return STR[key][lang];
}
