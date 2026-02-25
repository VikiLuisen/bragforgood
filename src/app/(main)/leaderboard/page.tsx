import { prisma } from "@/lib/prisma";
import { getKarmaTier, DEED_CATEGORIES, IMPACT_BADGES } from "@/lib/constants";
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content";

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

      const totalKarma = karmaMap[user.id] || 0;
      const tier = getKarmaTier(totalKarma);
      const catConfig = topCategory
        ? DEED_CATEGORIES[topCategory as keyof typeof DEED_CATEGORIES]
        : null;
      const badgeConfig = topCategory ? IMPACT_BADGES[topCategory] : null;

      return {
        id: user.id,
        name: user.name,
        image: user.image,
        currentStreak: user.currentStreak,
        monthlyKarma,
        monthlyDeeds,
        totalKarma,
        topCategory,
        tierTitle: tier.title,
        catColor: catConfig?.color || null,
        badgeLabel: badgeConfig
          ? `${monthlyDeeds === 1 ? badgeConfig.singular : badgeConfig.plural}`
          : null,
      };
    })
    .sort((a, b) => b.monthlyKarma - a.monthlyKarma || b.monthlyDeeds - a.monthlyDeeds)
    .slice(0, 20);

  return <LeaderboardContent users={leaderboard} monthName={monthName} />;
}
