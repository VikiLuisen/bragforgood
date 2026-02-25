import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { DeedFeed } from "@/components/deeds/deed-feed";
import { FeedHeader } from "@/components/deeds/feed-header";
import { PAGE_SIZE, REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType } from "@/lib/constants";

export default async function FeedPage() {
  const session = await auth();

  const deeds = await prisma.deed.findMany({
    where: { flagCount: { lt: 3 } },
    take: PAGE_SIZE + 1,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, participants: true } },
      reactions: true,
    },
  });

  const hasMore = deeds.length > PAGE_SIZE;
  const items = hasMore ? deeds.slice(0, PAGE_SIZE) : deeds;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  // Fetch karma scores for all authors in this batch
  const authorIds = [...new Set(items.map((d) => d.author.id))];
  const karmaCounts = await Promise.all(
    authorIds.map(async (id) => ({
      id,
      karma: await prisma.reaction.count({ where: { deed: { authorId: id } } }),
    }))
  );
  const karmaMap = Object.fromEntries(karmaCounts.map((k) => [k.id, k.karma]));

  const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];

  // Check which CTAs the current user has joined
  let joinedDeedIds = new Set<string>();
  if (session?.user?.id) {
    const ctaDeedIds = items.filter((d) => d.type === "CALL_TO_ACTION").map((d) => d.id);
    if (ctaDeedIds.length > 0) {
      const participations = await prisma.participant.findMany({
        where: { userId: session.user.id, deedId: { in: ctaDeedIds } },
        select: { deedId: true },
      });
      joinedDeedIds = new Set(participations.map((p) => p.deedId));
    }
  }

  // Fetch average ratings for past CTAs
  const pastCtaIds = items
    .filter((d) => d.type === "CALL_TO_ACTION" && d.eventDate && d.eventDate < new Date())
    .map((d) => d.id);
  const ratingAggMap = new Map<string, { avg: number; count: number }>();
  if (pastCtaIds.length > 0) {
    const ratingAggs = await prisma.rating.groupBy({
      by: ["deedId"],
      where: { deedId: { in: pastCtaIds } },
      _avg: { score: true },
      _count: true,
    });
    ratingAggs.forEach((r) => {
      ratingAggMap.set(r.deedId, {
        avg: Math.round((r._avg.score || 0) * 10) / 10,
        count: r._count,
      });
    });
  }

  const formattedDeeds = items.map((deed) => {
    const reactionCounts: Record<string, number> = {};
    reactionTypes.forEach((type) => {
      reactionCounts[type] = deed.reactions.filter((r) => r.type === type).length;
    });

    const userReactions = session?.user?.id
      ? deed.reactions
          .filter((r) => r.userId === session.user!.id)
          .map((r) => r.type)
      : [];

    return {
      id: deed.id,
      title: deed.title,
      description: deed.description,
      category: deed.category,
      photoUrls: deed.photoUrls,
      location: deed.location,
      isExample: deed.isExample,
      type: deed.type,
      eventDate: deed.eventDate?.toISOString() ?? null,
      eventEndDate: deed.eventEndDate?.toISOString() ?? null,
      meetingPoint: deed.meetingPoint,
      whatToBring: deed.whatToBring,
      maxSpots: deed.maxSpots,
      participantCount: deed._count.participants,
      isJoined: joinedDeedIds.has(deed.id),
      createdAt: deed.createdAt.toISOString(),
      author: {
        ...deed.author,
        karmaScore: karmaMap[deed.author.id] || 0,
      },
      averageRating: ratingAggMap.get(deed.id)?.avg,
      ratingCount: ratingAggMap.get(deed.id)?.count,
      _count: deed._count,
      reactionCounts,
      userReactions,
    };
  });

  return (
    <div>
      <FeedHeader isGuest={!session?.user} isLoggedIn={!!session?.user} />
      <DeedFeed
        initialDeeds={formattedDeeds as never[]}
        initialCursor={nextCursor}
        sessionUserId={session?.user?.id}
      />
    </div>
  );
}
