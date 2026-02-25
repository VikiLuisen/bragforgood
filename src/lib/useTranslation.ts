"use client";

import { useLanguage } from "@/lib/language-context";
import en from "@/lib/translations/en.json";
import de from "@/lib/translations/de.json";
import fr from "@/lib/translations/fr.json";
import it from "@/lib/translations/it.json";
import es from "@/lib/translations/es.json";

type TranslationMap = Record<string, unknown>;

const translations: Record<string, TranslationMap> = { en, de, fr, it, es };

function getNestedValue(obj: TranslationMap, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function useTranslation() {
  const { lang } = useLanguage();

  function t(key: string, vars?: Record<string, string | number>): string {
    const value =
      getNestedValue(translations[lang] || {}, key) ??
      getNestedValue(translations.en, key) ??
      key;

    if (!vars) return value;

    return value.replace(/\{(\w+)\}/g, (_, name) => {
      return vars[name] !== undefined ? String(vars[name]) : `{${name}}`;
    });
  }

  return { t, lang };
}
