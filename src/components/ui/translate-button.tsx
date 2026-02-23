"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { LanguageCode } from "@/lib/constants";

interface TranslateButtonProps {
  text: string;
  onTranslated: (translated: string | null) => void;
  compact?: boolean;
}

export function TranslateButton({ text, onTranslated, compact }: TranslateButtonProps) {
  const { lang, autoTranslate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [cachedTranslation, setCachedTranslation] = useState<string | null>(null);

  // Auto-translate when the setting is on and lang is not English
  useEffect(() => {
    if (autoTranslate && lang !== "en" && !isTranslated && !cachedTranslation) {
      handleTranslate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTranslate, lang]);

  async function handleTranslate() {
    if (isTranslated) {
      // Toggle back to original
      setIsTranslated(false);
      onTranslated(null);
      return;
    }

    if (cachedTranslation) {
      // Use cached translation
      setIsTranslated(true);
      onTranslated(cachedTranslation);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: lang }),
      });

      if (res.ok) {
        const data = await res.json();
        setCachedTranslation(data.translated);
        setIsTranslated(true);
        onTranslated(data.translated);
      }
    } catch {
      // Silently fail
    }
    setLoading(false);
  }

  // Don't show translate button if user's language is English (default)
  if (lang === "en") return null;

  const langName = SUPPORTED_LANGUAGES[lang as LanguageCode];

  return (
    <button
      onClick={handleTranslate}
      disabled={loading}
      className={`inline-flex items-center gap-1 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors ${
        compact ? "text-[10px]" : "text-[11px]"
      } font-medium`}
      title={isTranslated ? "Show original" : `Translate to ${langName}`}
    >
      {loading ? (
        <div className="w-3 h-3 border border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )}
      {isTranslated ? "Original" : langName}
    </button>
  );
}
