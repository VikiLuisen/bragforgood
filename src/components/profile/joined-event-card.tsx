"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge } from "@/components/deeds/category-badge";
import { StarDisplay } from "@/components/ratings/star-display";
import { RatingForm } from "@/components/ratings/rating-form";
import { formatEventDate } from "@/lib/utils";
import type { DeedCategory } from "@/lib/constants";
import type { RatingWithUser } from "@/types";

export interface JoinedEvent {
  participantId: string;
  joinedAt: string;
  message: string | null;
  isPublic: boolean;
  hasRated: boolean;
  userRating: number | null;
  deed: {
    id: string;
    title: string;
    category: string;
    type: string;
    isExample: boolean;
    eventDate: string | null;
    eventEndDate: string | null;
    meetingPoint: string | null;
    whatToBring: string | null;
    maxSpots: number | null;
    participantCount: number;
    author: {
      id: string;
      name: string;
      image: string | null;
      email?: string;
    };
  };
}

export function JoinedEventCard({ event, onLeft }: { event: JoinedEvent; onLeft?: (deedId: string) => void }) {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [hasRated, setHasRated] = useState(event.hasRated);
  const [userRating, setUserRating] = useState(event.userRating);
  const [leaving, setLeaving] = useState(false);

  const isPast = event.deed.eventDate ? new Date(event.deed.eventDate) < new Date() : false;

  async function handleLeave() {
    if (!confirm("Leave this event? You can always rejoin later.")) return;
    setLeaving(true);
    try {
      const res = await fetch(`/api/deeds/${event.deed.id}/participants`, { method: "DELETE" });
      if (res.ok) {
        onLeft?.(event.deed.id);
      }
    } catch {
      // ignore
    } finally {
      setLeaving(false);
    }
  }

  function handleRated(rating: RatingWithUser) {
    setHasRated(true);
    setUserRating(rating.score);
    setShowRatingForm(false);
  }

  return (
    <div className="card p-4 border-l-4 border-l-sky-500">
      {/* Header: title + status badges */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link href={`/deeds/${event.deed.id}`} className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors line-clamp-2">
          {event.deed.title}
        </Link>
        <div className="flex items-center gap-1.5 shrink-0">
          {event.deed.isExample && (
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
              Example
            </span>
          )}
          {!event.isPublic && (
            <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border border-[var(--border)]">
              Private
            </span>
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isPast ? "bg-[var(--bg-elevated)] text-[var(--text-tertiary)]" : "bg-sky-500/10 text-sky-400"}`}>
            {isPast ? "Passed" : "Upcoming"}
          </span>
        </div>
      </div>

      {/* Event details */}
      <div className="space-y-1 mb-3">
        {event.deed.eventDate && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatEventDate(event.deed.eventDate)}
            {event.deed.eventEndDate && ` to ${formatEventDate(event.deed.eventEndDate)}`}
          </div>
        )}
        {event.deed.meetingPoint && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {event.deed.meetingPoint}
          </div>
        )}
      </div>

      {/* Category + organizer */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <CategoryBadge category={event.deed.category as DeedCategory} />
        <span className="text-xs text-[var(--text-tertiary)]">by</span>
        <Link href={`/profile/${event.deed.author.id}`} className="flex items-center gap-1.5 hover:opacity-80">
          <Avatar name={event.deed.author.name} image={event.deed.author.image} size="sm" />
          <span className="text-xs font-medium text-[var(--text-secondary)]">{event.deed.author.name}</span>
        </Link>
        {event.deed.maxSpots && (
          <span className="text-xs text-[var(--text-tertiary)]">{event.deed.participantCount}/{event.deed.maxSpots} joined</span>
        )}
      </div>

      {/* User's rating */}
      {hasRated && userRating && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-[var(--text-tertiary)]">Your rating:</span>
          <StarDisplay score={userRating} size="sm" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {!isPast && (
          <button
            onClick={handleLeave}
            disabled={leaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {leaving ? "Leaving..." : "Leave"}
          </button>
        )}

        {event.deed.author.email && (
          <a
            href={`mailto:${event.deed.author.email}?subject=${encodeURIComponent(`About: ${event.deed.title}`)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-light)] hover:text-[var(--text-primary)] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Organizer
          </a>
        )}

        {isPast && !hasRated && (
          showRatingForm ? (
            <div className="w-full mt-2 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)]">
              <RatingForm deedId={event.deed.id} onRated={handleRated} />
            </div>
          ) : (
            <button
              onClick={() => setShowRatingForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Rate Event
            </button>
          )
        )}
      </div>
    </div>
  );
}
