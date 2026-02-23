import { Avatar } from "@/components/ui/avatar";
import { KarmaDisplay } from "./karma-display";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/types";

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="card-accent p-8 text-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <Avatar name={user.name} image={user.image} size="lg" className="!h-20 !w-20 !text-2xl" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{user.name}</h1>
          {user.bio && <p className="text-sm text-[var(--text-secondary)] mt-1">{user.bio}</p>}
          <p className="text-[11px] text-[var(--text-tertiary)] mt-1 font-medium uppercase tracking-wider">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-10 mt-2">
          <KarmaDisplay score={user.karmaScore} />
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[var(--text-primary)]">{user.deedCount}</div>
            <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest font-bold mt-0.5">Deeds</div>
          </div>
        </div>
      </div>
    </div>
  );
}
