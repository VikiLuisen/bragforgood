"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { KarmaDisplay } from "./karma-display";
import { StreakDisplay } from "./streak-display";
import { ImpactBadges } from "./impact-badges";
import { ProfileEditForm } from "./profile-edit-form";
import { formatDate } from "@/lib/utils";
import { getKarmaTier } from "@/lib/constants";
import type { UserProfile } from "@/types";

interface ProfileHeaderProps {
  user: UserProfile & {
    currentStreak?: number;
    longestStreak?: number;
    categoryCounts?: Record<string, number>;
  };
  isOwnProfile?: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const tier = getKarmaTier(user.karmaScore);

  if (editing) {
    return (
      <ProfileEditForm
        user={{ name: user.name, bio: user.bio, image: user.image }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="card-accent p-8 text-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <Avatar name={user.name} image={user.image} size="lg" karmaScore={user.karmaScore} className="!h-20 !w-20 !text-2xl" />
        <div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{user.name}</h1>
            {tier.title !== "Newcomer" && (
              <span className="text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent-dim)] px-2 py-0.5 rounded-full">
                {tier.title}
              </span>
            )}
          </div>
          {user.bio && <p className="text-sm text-[var(--text-secondary)] mt-1">{user.bio}</p>}
          <p className="text-[11px] text-[var(--text-tertiary)] mt-1 font-medium uppercase tracking-wider">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-8 mt-2">
          <KarmaDisplay score={user.karmaScore} />
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[var(--text-primary)]">{user.deedCount}</div>
            <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold mt-0.5">Posts</div>
          </div>
          {(user.currentStreak != null && user.longestStreak != null) && (
            <StreakDisplay currentStreak={user.currentStreak} longestStreak={user.longestStreak} />
          )}
        </div>

        {user.categoryCounts && Object.keys(user.categoryCounts).length > 0 && (
          <div className="mt-2">
            <ImpactBadges categoryCounts={user.categoryCounts} />
          </div>
        )}

        {isOwnProfile && (
          <button
            onClick={() => setEditing(true)}
            className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-light)] hover:text-[var(--text-primary)] transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
