"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ReactionButtonProps {
  emoji: string;
  label: string;
  count: number;
  isActive: boolean;
  compact?: boolean;
  onToggle: () => void;
}

export function ReactionButton({
  emoji,
  label,
  count,
  isActive,
  compact,
  onToggle,
}: ReactionButtonProps) {
  const [popping, setPopping] = useState(false);

  function handleClick() {
    setPopping(true);
    setTimeout(() => setPopping(false), 250);
    onToggle();
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-medium transition-all",
        popping && "reaction-pop",
        isActive
          ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(52,211,153,0.2)]"
          : "bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border border-transparent hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
      )}
      title={label}
    >
      <span className="text-sm">{emoji}</span>
      {!compact && <span className="hidden sm:inline text-[11px]">{label}</span>}
      {count > 0 && <span className="text-[11px]">{count}</span>}
    </button>
  );
}
