import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/avatar";
import { getKarmaTier, DEED_CATEGORIES, IMPACT_BADGES } from "@/lib/constants";
import Link from "next/link";

export default async function LeaderboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthName = now.toLocaleString("en", { month: "long", year: "numeric" });

  const usersWithDeeds = await prisma.user.findMany({
    where: {
      deeds: {
        some: {
          createdAt: { gte: monthStart },
        },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      currentStreak: true,
      deeds: {
        where: { createdAt: { gte: monthStart } },
        select: {
          category: true,
          reactions: { select: { id: true } },
        },
      },
    },
  });

  // Compute total karma for glow rings
  const allKarma = await Promise.all(
    usersWithDeeds.map(async (u) => ({
      id: u.id,
      totalKarma: await prisma.reaction.count({ where: { deed: { authorId: u.id } } }),
    }))
  );
  const karmaMap = Object.fromEntries(allKarma.map((k) => [k.id, k.totalKarma]));

  const leaderboard = usersWithDeeds
    .map((user) => {
      const monthlyKarma = user.deeds.reduce((sum, d) => sum + d.reactions.length, 0);
      const monthlyDeeds = user.deeds.length;
      const topCategory = Object.entries(
        user.deeds.reduce<Record<string, number>>((acc, d) => {
          acc[d.category] = (acc[d.category] || 0) + 1;
          return acc;
        }, {})
      ).sort(([, a], [, b]) => b - a)[0]?.[0];

      return {
        id: user.id,
        name: user.name,
        image: user.image,
        currentStreak: user.currentStreak,
        monthlyKarma,
        monthlyDeeds,
        totalKarma: karmaMap[user.id] || 0,
        topCategory,
      };
    })
    .sort((a, b) => b.monthlyKarma - a.monthlyKarma || b.monthlyDeeds - a.monthlyDeeds)
    .slice(0, 20);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Top Helpers</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{monthName}</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-secondary)]">No brags posted this month yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((user, i) => {
            const tier = getKarmaTier(user.totalKarma);
            const catConfig = user.topCategory
              ? DEED_CATEGORIES[user.topCategory as keyof typeof DEED_CATEGORIES]
              : null;
            const badgeConfig = user.topCategory ? IMPACT_BADGES[user.topCategory] : null;

            return (
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
                    <span className="text-[10px] font-medium text-[var(--accent)]">{tier.title}</span>
                    {user.currentStreak > 0 && (
                      <span className="text-[10px] text-[var(--text-tertiary)]">🔥 {user.currentStreak}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {catConfig && badgeConfig && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catConfig.color}`}>
                        {user.monthlyDeeds} {user.monthlyDeeds === 1 ? badgeConfig.singular : badgeConfig.plural}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-gradient">{user.monthlyKarma}</div>
                  <div className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider font-bold">karma</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
