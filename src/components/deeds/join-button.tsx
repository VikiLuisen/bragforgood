"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/useTranslation";

interface JoinButtonProps {
  deedId: string;
  initialIsJoined: boolean;
  initialCount: number;
  maxSpots: number | null;
  isAuthor: boolean;
  isPast: boolean;
  sessionUserId?: string;
  isExample?: boolean;
  compact?: boolean;
}

export function JoinButton({
  deedId,
  initialIsJoined,
  initialCount,
  maxSpots,
  isAuthor,
  isPast,
  sessionUserId,
  isExample,
  compact,
}: JoinButtonProps) {
  const [isJoined, setIsJoined] = useState(initialIsJoined);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [showExampleWarning, setShowExampleWarning] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();

  const isFull = maxSpots !== null && count >= maxSpots;

  function handleClick() {
    if (!sessionUserId) {
      router.push("/sign-in");
      return;
    }

    if (pending || isAuthor || isPast) return;

    // If already joined, toggle off (leave)
    if (isJoined) {
      handleToggle();
      return;
    }

    // Not joined yet: check if example first
    if (isExample && !showExampleWarning && !showMessageInput) {
      setShowExampleWarning(true);
      return;
    }

    // Show message input if not already showing
    if (!showMessageInput) {
      setShowMessageInput(true);
      return;
    }
  }

  function handleExampleConfirm() {
    setShowExampleWarning(false);
    setShowMessageInput(true);
  }

  function handleExampleCancel() {
    setShowExampleWarning(false);
  }

  async function handleToggle() {
    if (pending) return;
    setPending(true);

    const wasJoined = isJoined;
    setIsJoined(!wasJoined);
    setCount((c) => c + (wasJoined ? -1 : 1));
    setShowMessageInput(false);

    try {
      const res = await fetch(`/api/deeds/${deedId}/participants`, {
        method: wasJoined ? "DELETE" : "POST",
        ...((!wasJoined) ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(message.trim() ? { message: message.trim() } : {}),
            isPublic,
          }),
        } : {}),
      });

      if (res.ok) {
        const data = await res.json();
        setCount(data.participantCount);
        setMessage("");
        setIsPublic(true);
      } else {
        setIsJoined(wasJoined);
        setCount((c) => c + (wasJoined ? 1 : -1));
      }
    } catch {
      setIsJoined(wasJoined);
      setCount((c) => c + (wasJoined ? 1 : -1));
    }

    setPending(false);
  }

  function handleJoinWithMessage() {
    handleToggle();
  }

  function handleCancelMessage() {
    setShowMessageInput(false);
    setMessage("");
    setIsPublic(true);
  }

  if (isPast) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? "text-[11px]" : "text-xs"} text-[var(--text-tertiary)] font-medium`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t("deed.eventPassed")}
        {count > 0 && <span> &middot; {t("deed.signedUpCount", { count })}</span>}
      </div>
    );
  }

  const spotsLabel = maxSpots
    ? `${count}/${maxSpots}`
    : `${count}`;

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleClick}
          disabled={pending || isAuthor || (isFull && !isJoined)}
          className={`inline-flex items-center gap-1.5 ${compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs"} rounded-full font-semibold transition-all ${
            isJoined
              ? "bg-sky-500/15 text-sky-400 border border-sky-500/25 hover:bg-sky-500/25"
              : isFull
                ? "bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border border-[var(--border)] cursor-not-allowed"
                : "bg-sky-500 text-white hover:bg-sky-600 shadow-sm"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isJoined ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t("deed.signedUp")}
            </>
          ) : isFull ? (
            t("deed.full")
          ) : isAuthor ? (
            t("deed.yourEvent")
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t("deed.signUp")}
            </>
          )}
        </button>
        <span className={`${compact ? "text-[11px]" : "text-xs"} text-[var(--text-tertiary)] font-medium`}>
          <svg className="w-3.5 h-3.5 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {maxSpots ? t("deed.spotsCount", { count, max: maxSpots }) : t("deed.signedUpCount", { count })}
        </span>
      </div>

      {/* Example post warning */}
      {showExampleWarning && (
        <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-300 font-medium mb-2">
            {t("deed.exampleWarning")}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExampleConfirm}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              {t("deed.letMeTryIt")}
            </button>
            <button
              onClick={handleExampleCancel}
              className="px-2 py-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Post-signup hint */}
      {isJoined && !showMessageInput && !showExampleWarning && (
        <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)]">
          {t("deed.profileHint")}
        </p>
      )}

      {/* Message input + privacy toggle */}
      {showMessageInput && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t("deed.optionalBring")}
              maxLength={200}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoinWithMessage(); }}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-sky-500/30 placeholder:text-[var(--text-tertiary)]"
              autoFocus
            />
            <button
              onClick={handleJoinWithMessage}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
            >
              {t("deed.signUp")}
            </button>
            <button
              onClick={handleCancelMessage}
              className="px-2 py-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {t("common.cancel")}
            </button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-[var(--border)] bg-[var(--bg-card)] text-sky-500 focus:ring-sky-500/30 w-3.5 h-3.5"
            />
            <span className="text-[11px] text-[var(--text-tertiary)]">
              {t("deed.showName")}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
