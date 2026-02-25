"use client";

import { useState } from "react";
import type { RatingWithUser } from "@/types";

export function RatingForm({ deedId, onRated }: { deedId: string; onRated: (rating: RatingWithUser) => void }) {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (score === 0) {
      setError("Pick a star rating");
      return;
    }
    setPending(true);
    setError("");

    try {
      const res = await fetch(`/api/deeds/${deedId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, comment: comment || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      const rating = await res.json();
      onRated(rating);
    } catch {
      setError("Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">How was it?</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setScore(star)}
              className="transition-transform hover:scale-110"
            >
              <svg className={`w-7 h-7 ${(hovered || score) >= star ? "text-amber-400" : "text-[var(--text-tertiary)]"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment (optional)"
        maxLength={500}
        rows={2}
        className="w-full rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending || score === 0}
        className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[var(--accent)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {pending ? "Submitting..." : "Submit Rating"}
      </button>
    </form>
  );
}
