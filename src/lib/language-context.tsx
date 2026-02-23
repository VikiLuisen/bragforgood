"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { LanguageCode } from "@/lib/constants";

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  autoTranslate: boolean;
  setAutoTranslate: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  autoTranslate: false,
  setAutoTranslate: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [lang, setLangState] = useState<LanguageCode>("en");
  const [autoTranslate, setAutoTranslateState] = useState(false);

  // Fetch user's preferred language on mount
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/users/language")
      .then((res) => res.json())
      .then((data) => {
        if (data.lang) setLangState(data.lang as LanguageCode);
      })
      .catch(() => {});
  }, [session?.user]);

  // Load auto-translate preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bfg-auto-translate");
    if (stored === "true") setAutoTranslateState(true);
  }, []);

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang);
    // Save to server
    fetch("/api/users/language", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: newLang }),
    }).catch(() => {});
  }, []);

  const setAutoTranslate = useCallback((value: boolean) => {
    setAutoTranslateState(value);
    localStorage.setItem("bfg-auto-translate", String(value));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, autoTranslate, setAutoTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
