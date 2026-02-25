export const DEED_CATEGORIES = {
  ENVIRONMENT: { label: "Environment", color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  HELPING_NEIGHBORS: { label: "Neighbors", color: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  ANIMAL_WELFARE: { label: "Animals", color: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  VOLUNTEERING: { label: "Volunteering", color: "bg-purple-500/15 text-purple-400 border border-purple-500/20" },
  MENTORING: { label: "Mentoring", color: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20" },
  RANDOM_KINDNESS: { label: "Kindness", color: "bg-pink-500/15 text-pink-400 border border-pink-500/20" },
} as const;

export type DeedCategory = keyof typeof DEED_CATEGORIES;

export const REACTION_CONFIG = {
  INSPIRED: { emoji: "\u2728", label: "Inspired" },
  THANK_YOU: { emoji: "\ud83d\ude4f", label: "Thank You" },
  AMAZING: { emoji: "\ud83e\udd29", label: "Amazing" },
  KEEP_GOING: { emoji: "\ud83d\udcaa", label: "Keep Going" },
} as const;

export type ReactionType = keyof typeof REACTION_CONFIG;

export const DEED_TYPES = {
  BRAG: { label: "Brag", icon: "megaphone" },
  CALL_TO_ACTION: { label: "Call to Action", icon: "calendar" },
} as const;

export type DeedType = keyof typeof DEED_TYPES;

export const PAGE_SIZE = 10;

// Karma tier system — thresholds, titles, and glow ring styles
export const KARMA_TIERS = [
  { min: 60, title: "Legend", ring: "ring-purple-400", glow: "shadow-[0_0_12px_rgba(167,139,250,0.5),0_0_24px_rgba(96,165,250,0.3)]" },
  { min: 30, title: "Beacon", ring: "ring-blue-400", glow: "shadow-[0_0_10px_rgba(96,165,250,0.45)]" },
  { min: 15, title: "Flame", ring: "ring-emerald-400", glow: "shadow-[0_0_8px_rgba(52,211,153,0.4)]" },
  { min: 5, title: "Spark", ring: "ring-emerald-400/60", glow: "shadow-[0_0_6px_rgba(52,211,153,0.25)]" },
  { min: 0, title: "Newcomer", ring: "", glow: "" },
] as const;

export function getKarmaTier(score: number) {
  return KARMA_TIERS.find((t) => score >= t.min) || KARMA_TIERS[KARMA_TIERS.length - 1];
}

// Impact badge labels per category
export const IMPACT_BADGES: Record<string, { singular: string; plural: string }> = {
  ENVIRONMENT: { singular: "cleanup", plural: "cleanups" },
  HELPING_NEIGHBORS: { singular: "neighbor helped", plural: "neighbors helped" },
  ANIMAL_WELFARE: { singular: "animal rescue", plural: "animal rescues" },
  VOLUNTEERING: { singular: "volunteer shift", plural: "volunteer shifts" },
  MENTORING: { singular: "person mentored", plural: "people mentored" },
  RANDOM_KINDNESS: { singular: "act of kindness", plural: "acts of kindness" },
};

export const SUPPORTED_LANGUAGES = {
  en: "English",
  de: "Deutsch",
  fr: "Fran\u00e7ais",
  es: "Espa\u00f1ol",
  it: "Italiano",
  pt: "Portugu\u00eas",
  nl: "Nederlands",
  ja: "\u65e5\u672c\u8a9e",
  ko: "\ud55c\uad6d\uc5b4",
  zh: "\u4e2d\u6587",
  ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
  hi: "\u0939\u093f\u0928\u094d\u0926\u0940",
  tr: "T\u00fcrk\u00e7e",
  ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
  pl: "Polski",
  sv: "Svenska",
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Languages with full UI translation files (subset of SUPPORTED_LANGUAGES)
export const UI_LANGUAGES = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
} as const;

export type UILanguageCode = keyof typeof UI_LANGUAGES;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
