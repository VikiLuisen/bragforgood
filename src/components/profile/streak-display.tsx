interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  if (currentStreak === 0 && longestStreak === 0) return null;

  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold text-[var(--text-primary)]">
        <span className={currentStreak > 0 ? "animate-pulse" : ""}>🔥</span> {currentStreak}
      </div>
      <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold mt-0.5">
        Day Streak
      </div>
      {longestStreak > currentStreak && (
        <div className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
          Best: {longestStreak}
        </div>
      )}
    </div>
  );
}
