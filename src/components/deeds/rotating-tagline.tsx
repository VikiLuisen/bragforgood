"use client";

import { useState, useEffect } from "react";

const taglines = [
  "Doing good is contagious. So is talking about it.",
  "Make someone\u2019s day. Then tell us about it.",
  "Show off your good side.",
];

export function RotatingTagline() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

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
