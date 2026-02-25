"use client";

import { useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { DeedCard } from "./deed-card";
import type { DeedWithAuthor } from "@/types";

type FeedFilter = "ALL" | "BRAG" | "CALL_TO_ACTION";

interface DeedFeedProps {
  initialDeeds: DeedWithAuthor[];
  initialCursor: string | null;
  sessionUserId?: string;
}

export function DeedFeed({ initialDeeds, initialCursor, sessionUserId }: DeedFeedProps) {
  const [filter, setFilter] = useState<FeedFilter>("ALL");
  const [deeds, setDeeds] = useState(initialDeeds);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;
    setLoading(true);

    const typeParam = filter !== "ALL" ? `&type=${filter}` : "";
    const res = await fetch(`/api/deeds?cursor=${cursor}${typeParam}`);
    const data = await res.json();

    setDeeds((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setLoading(false);
  }, [cursor, loading, filter]);

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) loadMore();
    },
  });

  async function handleFilterChange(newFilter: FeedFilter) {
    if (newFilter === filter) return;
    setFilter(newFilter);
    setFilterLoading(true);

    const typeParam = newFilter !== "ALL" ? `?type=${newFilter}` : "";
    const res = await fetch(`/api/deeds${typeParam}`);
    const data = await res.json();

    setDeeds(data.items);
    setCursor(data.nextCursor);
    setFilterLoading(false);
  }

  const filters: { key: FeedFilter; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "BRAG", label: "Brags" },
    { key: "CALL_TO_ACTION", label: "Calls to Action" },
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl bg-[var(--bg-elevated)]">
        {filters.map(({ key, label }) => (
          <div key={key} className="flex-1 flex items-center">
            <button
              onClick={() => handleFilterChange(key)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === key
                  ? key === "CALL_TO_ACTION"
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-[var(--accent)] text-[#0a0a0b] shadow-sm"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {label}
            </button>
            {key !== "ALL" && (
              <Link
                href={`/deeds/new?type=${key}`}
                className={`ml-0.5 w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold transition-all shrink-0 ${
                  key === "CALL_TO_ACTION"
                    ? "text-sky-400 hover:bg-sky-500/20"
                    : "text-[var(--accent)] hover:bg-[var(--accent-dim)]"
                }`}
                title={key === "CALL_TO_ACTION" ? "New Call to Action" : "New Brag"}
              >
                +
              </Link>
            )}
          </div>
        ))}
      </div>

      {filterLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : deeds.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-5xl mb-4">{filter === "CALL_TO_ACTION" ? "📅" : "📢"}</div>
          <p className="text-[var(--text-primary)] text-lg font-semibold">
            {filter === "CALL_TO_ACTION" ? "No calls to action yet" : filter === "BRAG" ? "No brags yet" : "No one's bragging yet"}
          </p>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">
            {filter === "CALL_TO_ACTION" ? "Be the first to rally the troops" : "Be the first to show off something good"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deeds.map((deed) => (
            <DeedCard key={deed.id} deed={deed} sessionUserId={sessionUserId} />
          ))}

          {cursor && (
            <div ref={ref} className="space-y-3">
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
