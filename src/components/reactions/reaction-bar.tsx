"use client";

import { useState } from "react";
import { ReactionButton } from "./reaction-button";
import { REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType } from "@/lib/constants";

interface ReactionBarProps {
  deedId: string;
  initialCounts: Record<string, number>;
  initialUserReactions: string[];
  compact?: boolean;
}

export function ReactionBar({
  deedId,
  initialCounts,
  initialUserReactions,
  compact,
}: ReactionBarProps) {
  const [counts, setCounts] = useState(initialCounts);
  const [userReactions, setUserReactions] = useState<string[]>(initialUserReactions);
  const [pending, setPending] = useState(false);

  async function toggleReaction(type: ReactionType) {
    if (pending) return;

    // Optimistic update
    const isActive = userReactions.includes(type);
    const newUserReactions = isActive
      ? userReactions.filter((r) => r !== type)
      : [...userReactions, type];
    const newCounts = {
      ...counts,
      [type]: (counts[type] || 0) + (isActive ? -1 : 1),
    };

    setUserReactions(newUserReactions);
    setCounts(newCounts);
    setPending(true);

    try {
      const res = await fetch(`/api/deeds/${deedId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts);
        setUserReactions(data.userReactions);
      } else {
        // Revert on error
        setUserReactions(isActive ? [...userReactions] : userReactions.filter((r) => r !== type));
        setCounts(initialCounts);
      }
    } catch {
      setUserReactions(isActive ? [...userReactions] : userReactions.filter((r) => r !== type));
      setCounts(initialCounts);
    }

    setPending(false);
  }

  const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];

  return (
    <div className="flex items-center gap-1.5">
      {reactionTypes.map((type) => (
        <ReactionButton
          key={type}
          emoji={REACTION_CONFIG[type].emoji}
          label={REACTION_CONFIG[type].label}
          count={counts[type] || 0}
          isActive={userReactions.includes(type)}
          compact={compact}
          onToggle={() => toggleReaction(type)}
        />
      ))}
    </div>
  );
}
