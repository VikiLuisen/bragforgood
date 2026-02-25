"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface JoinButtonProps {
  deedId: string;
  initialIsJoined: boolean;
  initialCount: number;
  maxSpots: number | null;
  isAuthor: boolean;
  isPast: boolean;
  sessionUserId?: string;
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
  compact,
}: JoinButtonProps) {
  const [isJoined, setIsJoined] = useState(initialIsJoined);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const isFull = maxSpots !== null && count >= maxSpots;

  async function handleToggle() {
    if (!sessionUserId) {
      router.push("/sign-in");
      return;
    }

    if (pending || isAuthor || isPast) return;

    if (!isJoined && !showMessageInput) {
      setShowMessageInput(true);
      return;
    }

    setPending(true);

    // Optimistic update
    const wasJoined = isJoined;
    setIsJoined(!wasJoined);
    setCount((c) => c + (wasJoined ? -1 : 1));
    setShowMessageInput(false);

    try {
      const res = await fetch(`/api/deeds/${deedId}/participants`, {
        method: wasJoined ? "DELETE" : "POST",
        ...((!wasJoined && message.trim()) ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message.trim() }),
        } : {}),
      });

      if (res.ok) {
        const data = await res.json();
        setCount(data.participantCount);
        setMessage("");
      } else {
        // Revert
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
  }

  if (isPast) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${compact ? "text-[11px]" : "text-xs"} text-[var(--text-tertiary)] font-medium`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Event passed
        {count > 0 && <span> &middot; {count} joined</span>}
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
          onClick={handleToggle}
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
              I&apos;m in!
            </>
          ) : isFull ? (
            "Full"
          ) : isAuthor ? (
            "Your event"
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              I&apos;m in!
            </>
          )}
        </button>
        <span className={`${compact ? "text-[11px]" : "text-xs"} text-[var(--text-tertiary)] font-medium`}>
          <svg className="w-3.5 h-3.5 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {spotsLabel} joined
        </span>
      </div>

      {showMessageInput && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Optional: I'll bring..."
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
            Join
          </button>
          <button
            onClick={handleCancelMessage}
            className="px-2 py-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
