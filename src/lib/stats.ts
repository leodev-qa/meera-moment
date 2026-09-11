const KEY = "meera-moment-stats";

export type Stats = {
  moments: number;
  shares: number;
  wafa: number;
  ugc: number;
  byEvent: Record<string, number>;
};

export const SEED: Stats = {
  moments: 1842,
  shares: 1308,
  wafa: 412,
  ugc: 967,
  byEvent: {
    shail: 286,
    school: 194,
    national: 0,
    f1: 0,
    sustain: 0,
    anniversary: 0,
    everyday: 1362,
  },
};

function merge(partial: Partial<Stats> | null | undefined): Stats {
  const base = structuredClone(SEED);
  if (!partial) return base;
  return {
    moments: partial.moments ?? base.moments,
    shares: partial.shares ?? base.shares,
    wafa: partial.wafa ?? base.wafa,
    ugc: partial.ugc ?? base.ugc,
    byEvent: { ...base.byEvent, ...(partial.byEvent ?? {}) },
  };
}

export function loadStats(): Stats {
  if (typeof window === "undefined") return structuredClone(SEED);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return structuredClone(SEED);
    }
    return merge(JSON.parse(raw) as Partial<Stats>);
  } catch {
    return structuredClone(SEED);
  }
}

export function saveStats(s: Stats) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function bump(
  kind: "moments" | "shares" | "wafa" | "ugc",
  eventId?: string,
) {
  const s = loadStats();
  s[kind] += 1;
  if (kind === "moments" && eventId) {
    s.byEvent[eventId] = (s.byEvent[eventId] ?? 0) + 1;
  }
  saveStats(s);
  return s;
}

export function shareRate(s: Stats) {
  if (!s.moments) return 0;
  return Math.round((s.shares / s.moments) * 100);
}

export function reach(s: Stats) {
  return s.shares * 86;
}
