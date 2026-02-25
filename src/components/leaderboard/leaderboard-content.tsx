"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { useTranslation } from "@/lib/useTranslation";

interface LeaderboardUser {
  id: string;
  name: string;
  image: string | null;
  currentStreak: number;
  monthlyKarma: number;
  monthlyDeeds: number;
  totalKarma: number;
  topCategory: string | undefined;
  tierTitle: string;
  catColor: string | null;
  badgeLabel: string | null;
}

interface LeaderboardContentProps {
  users: LeaderboardUser[];
  monthName: string;
}

const medals = ["🥇", "🥈", "🥉"];

export function LeaderboardContent({ users, monthName }: LeaderboardContentProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t("leaderboard.title")}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{monthName}</p>
      </div>

      {users.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-secondary)]">{t("leaderboard.noActivity")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user, i) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="card p-4 flex items-center gap-4 hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <div className="w-8 text-center shrink-0">
                {i < 3 ? (
                  <span className="text-xl">{medals[i]}</span>
                ) : (
                  <span className="text-sm font-bold text-[var(--text-tertiary)]">{i + 1}</span>
                )}
              </div>

              <Avatar name={user.name} image={user.image} size="md" karmaScore={user.totalKarma} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</span>
                  <span className="text-[10px] font-medium text-[var(--accent)]">{user.tierTitle}</span>
                  {user.currentStreak > 0 && (
                    <span className="text-[10px] text-[var(--text-tertiary)]">🔥 {user.currentStreak}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {user.catColor && user.badgeLabel && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${user.catColor}`}>
                      {user.monthlyDeeds} {user.badgeLabel}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-gradient">{user.monthlyKarma}</div>
                <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider font-bold">{t("leaderboard.karma")}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
