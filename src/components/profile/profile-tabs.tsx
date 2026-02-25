"use client";

import { useState, useCallback } from "react";
import { DeedFeed } from "@/components/deeds/deed-feed";
import { JoinedEventCard, type JoinedEvent } from "./joined-event-card";
import { useTranslation } from "@/lib/useTranslation";
import type { DeedWithAuthor } from "@/types";

interface ProfileTabsProps {
  userId: string;
  initialDeeds: DeedWithAuthor[];
  initialDeedsCursor: string | null;
  initialJoinedEvents: JoinedEvent[];
  initialJoinedCursor: string | null;
  isOwnProfile: boolean;
}

export function ProfileTabs({
  userId,
  initialDeeds,
  initialDeedsCursor,
  initialJoinedEvents,
  initialJoinedCursor,
  isOwnProfile,
}: ProfileTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"posts" | "joined">("posts");
  const [joinedEvents, setJoinedEvents] = useState(initialJoinedEvents);
  const [joinedCursor, setJoinedCursor] = useState(initialJoinedCursor);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLeft = useCallback((deedId: string) => {
    setJoinedEvents((prev) => prev.filter((e) => e.deed.id !== deedId));
  }, []);

  async function loadMoreJoined() {
    if (!joinedCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/users/${userId}/joined-events?cursor=${joinedCursor}`);
      if (res.ok) {
        const data = await res.json();
        setJoinedEvents((prev) => [...prev, ...data.items]);
        setJoinedCursor(data.nextCursor);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }

  const tabs = [
    { id: "posts" as const, label: t("profile.tabPosts"), count: null },
    { id: "joined" as const, label: t("profile.tabJoined"), count: initialJoinedEvents.length > 0 ? initialJoinedEvents.length : null },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {tab.label}
            {tab.count ? ` (${tab.count})` : ""}
          </button>
        ))}
      </div>

      {/* Posts tab */}
      {activeTab === "posts" && (
        <DeedFeed
          initialDeeds={initialDeeds}
          initialCursor={initialDeedsCursor}
          fetchUrl={`/api/users/${userId}/deeds`}
          showFilters={false}
        />
      )}

      {/* Joined events tab */}
      {activeTab === "joined" && (
        <div className="space-y-3">
          {joinedEvents.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-[var(--text-tertiary)]">
                {isOwnProfile ? t("profile.noJoinedOwn") : t("profile.noJoined")}
              </p>
            </div>
          ) : (
            <>
              {joinedEvents.map((event) => (
                <JoinedEventCard
                  key={event.participantId}
                  event={event}
                  onLeft={isOwnProfile ? handleLeft : undefined}
                />
              ))}
              {joinedCursor && (
                <button
                  onClick={loadMoreJoined}
                  disabled={loadingMore}
                  className="w-full py-3 text-sm font-semibold text-[var(--accent)] hover:underline disabled:opacity-50"
                >
                  {loadingMore ? t("common.loading") : t("common.loadMore")}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
