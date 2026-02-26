import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the start of the current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Find users who have deeds this month, ranked by reactions received this month
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
            id: true,
            category: true,
            reactions: { select: { id: true } },
          },
        },
      },
    });

    const leaderboard = usersWithDeeds
      .map((user) => {
        const monthlyKarma = user.deeds.reduce((sum, d) => sum + d.reactions.length, 0);
        const monthlyDeeds = user.deeds.length;

        // Count deeds by category
        const categoryCounts: Record<string, number> = {};
        user.deeds.forEach((d) => {
          categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
        });

        // Find top category
        const topCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;

        return {
          id: user.id,
          name: user.name,
          image: user.image,
          monthlyKarma,
          monthlyDeeds,
          currentStreak: user.currentStreak,
          topCategory,
        };
      })
      .sort((a, b) => b.monthlyKarma - a.monthlyKarma || b.monthlyDeeds - a.monthlyDeeds)
      .slice(0, 20);

    // Also compute total karma for glow rings
    const karmaScores = await Promise.all(
      leaderboard.map(async (u) => ({
        id: u.id,
        totalKarma: await prisma.reaction.count({ where: { deed: { authorId: u.id } } }),
      }))
    );
    const karmaMap = Object.fromEntries(karmaScores.map((k) => [k.id, k.totalKarma]));

    const result = leaderboard.map((u) => ({
      ...u,
      totalKarma: karmaMap[u.id] || 0,
    }));

    const monthName = now.toLocaleString("en", { month: "long", year: "numeric" });

    return NextResponse.json({ leaderboard: result, month: monthName });
  } catch (err) {
    logger.error("leaderboard.error", { error: String(err) });
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}
