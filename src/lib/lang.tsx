import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "./copy";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "rtl" | "ltr";
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const value = useMemo<Ctx>(
    () => ({ lang, setLang, dir: lang === "ar" ? "rtl" : "ltr" }),
    [lang],
  );
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("LangProvider missing");
  return ctx;
}
