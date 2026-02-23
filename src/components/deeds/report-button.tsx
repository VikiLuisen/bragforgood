"use client";

import { useState } from "react";

interface ReportButtonProps {
  deedId: string;
}

const REASONS = [
  { value: "not_good_deed", label: "Not a good deed" },
  { value: "spam", label: "Spam / self-promotion" },
  { value: "offensive", label: "Offensive content" },
  { value: "other", label: "Other" },
];

export function ReportButton({ deedId }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleReport(reason: string) {
    setError("");
    const res = await fetch(`/api/deeds/${deedId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to report");
    }
  }

  if (submitted) {
    return (
      <span className="text-[11px] text-[var(--accent)] font-medium">
        Reported — thanks
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1"
        title="Report post"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-full mb-1 z-50 w-48 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-xl py-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Report as
            </div>
            {error && (
              <div className="px-3 py-1 text-[10px] text-red-400">{error}</div>
            )}
            {REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => handleReport(r.value)}
                className="w-full text-left px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                {r.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
