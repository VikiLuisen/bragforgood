"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { useTranslation } from "@/lib/useTranslation";
import { SUPPORTED_LANGUAGES, UI_LANGUAGES } from "@/lib/constants";
import type { LanguageCode, UILanguageCode } from "@/lib/constants";

export function LanguageSelector() {
  const { lang, setLang, autoTranslate, setAutoTranslate } = useLanguage();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uiLanguages = Object.entries(UI_LANGUAGES) as [UILanguageCode, string][];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
        title="Language settings"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="hidden sm:inline">{SUPPORTED_LANGUAGES[lang]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/40 py-1 z-50 animate-fade-in max-h-80 overflow-y-auto">
          {/* Auto-translate toggle */}
          <div className="px-4 py-2.5 border-b border-[var(--border)]">
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className="flex items-center justify-between w-full text-[12px] font-medium"
            >
              <span className="text-[var(--text-secondary)]">{t("langSelector.autoTranslate")}</span>
              <div className={`w-8 h-4.5 rounded-full transition-colors relative ${autoTranslate ? "bg-[var(--accent)]" : "bg-[var(--border-light)]"}`}>
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${autoTranslate ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </button>
          </div>

          <div className="py-1">
            <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              {t("langSelector.language")}
            </div>
            {uiLanguages.map(([code, name]) => (
              <button
                key={code}
                onClick={() => {
                  setLang(code);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                  lang === code
                    ? "text-[var(--accent)] bg-[var(--accent-dim)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                {name}
                {code === "en" && <span className="text-[var(--text-tertiary)] ml-1.5 text-[11px]">(original)</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
