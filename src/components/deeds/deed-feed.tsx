"use client";

import { useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { DeedCard } from "./deed-card";
import type { DeedWithAuthor } from "@/types";

interface DeedFeedProps {
  initialDeeds: DeedWithAuthor[];
  initialCursor: string | null;
}

export function DeedFeed({ initialDeeds, initialCursor }: DeedFeedProps) {
  const [deeds, setDeeds] = useState(initialDeeds);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;
    setLoading(true);

    const res = await fetch(`/api/deeds?cursor=${cursor}`);
    const data = await res.json();

    setDeeds((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setLoading(false);
  }, [cursor, loading]);

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) loadMore();
    },
  });

  if (deeds.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-5xl mb-4">📢</div>
        <p className="text-[var(--text-primary)] text-lg font-semibold">No one&apos;s bragging yet</p>
        <p className="text-[var(--text-tertiary)] text-sm mt-1">
          Be the first to show off something good
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deeds.map((deed) => (
        <DeedCard key={deed.id} deed={deed} />
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
  );
}
