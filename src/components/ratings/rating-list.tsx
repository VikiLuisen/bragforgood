"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { StarDisplay } from "./star-display";
import { RatingForm } from "./rating-form";
import { useTranslation } from "@/lib/useTranslation";
import { formatDate } from "@/lib/utils";
import type { RatingWithUser } from "@/types";

interface RatingListProps {
  deedId: string;
  initialRatings: RatingWithUser[];
  initialAverage: number;
  initialCount: number;
  canRate: boolean;
}

export function RatingList({ deedId, initialRatings, initialAverage, initialCount, canRate }: RatingListProps) {
  const { t } = useTranslation();
  const [ratings, setRatings] = useState(initialRatings);
  const [average, setAverage] = useState(initialAverage);
  const [count, setCount] = useState(initialCount);
  const [showForm, setShowForm] = useState(false);
  const [hasRated, setHasRated] = useState(!canRate);

  function handleRated(rating: RatingWithUser) {
    setRatings((prev) => [rating, ...prev]);
    const newCount = count + 1;
    setCount(newCount);
    setAverage(Math.round(((average * count + rating.score) / newCount) * 10) / 10);
    setShowForm(false);
    setHasRated(true);
  }

  return (
    <div className="space-y-4">
      {/* Average display */}
      {count > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[var(--text-primary)]">{average}</span>
          <div>
            <StarDisplay score={average} size="md" />
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{count} {count !== 1 ? t("ratings.ratingsLabel") : t("ratings.ratingLabel")}</p>
          </div>
        </div>
      )}

      {/* Rate button / form */}
      {!hasRated && (
        showForm ? (
          <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
            <RatingForm deedId={deedId} onRated={handleRated} />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t("ratings.rateThis")}
          </button>
        )
      )}

      {/* Individual ratings */}
      {ratings.length > 0 && (
        <div className="space-y-3">
          {ratings.map((r) => (
            <div key={r.id} className="flex gap-3">
              <Avatar name={r.user.name} image={r.user.image} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{r.user.name}</span>
                  <StarDisplay score={r.score} size="sm" />
                  <span className="text-xs text-[var(--text-tertiary)]">{formatDate(r.createdAt)}</span>
                </div>
                {r.comment && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{r.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {count === 0 && hasRated && (
        <p className="text-sm text-[var(--text-tertiary)]">{t("ratings.noRatings")}</p>
      )}
    </div>
  );
}
