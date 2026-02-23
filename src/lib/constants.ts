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

export const PAGE_SIZE = 10;

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
