"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/useTranslation";

export function RotatingTagline() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const taglines = [
    t("feed.tagline1"),
    t("feed.tagline2"),
    t("feed.tagline3"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % taglines.length);
        setFade(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`text-[13px] text-[var(--text-tertiary)] mt-0.5 transition-opacity duration-300 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {taglines[index]}
    </p>
  );
}
