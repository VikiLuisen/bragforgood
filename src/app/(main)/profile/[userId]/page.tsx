import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { PAGE_SIZE, REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType } from "@/lib/constants";
import type { UserProfile } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, bio: true, image: true },
  });

  if (!user) return { title: "User not found" };

  return {
    title: `${user.name}'s Profile`,
    description: user.bio || `Check out ${user.name}'s good deeds on bragforgood.`,
    openGraph: {
      title: `${user.name} on bragforgood`,
      description: user.bio || `Check out ${user.name}'s good deeds on bragforgood.`,
      ...(user.image && { images: [{ url: user.image }] }),
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      currentStreak: true,
      longestStreak: true,
      createdAt: true,
      _count: { select: { deeds: true } },
    },
  });

  if (!user) notFound();

  const karmaScore = await prisma.reaction.count({
    where: { deed: { authorId: userId } },
  });

  // Get deed counts by category for impact badges
  const deedsByCategory = await prisma.deed.groupBy({
    by: ["category"],
    where: { authorId: userId },
    _count: true,
  });
  const categoryCounts: Record<string, number> = {};
  deedsByCategory.forEach((d) => {
    categoryCounts[d.category] = d._count;
  });

  const isOwnProfile = session?.user?.id === userId;

  const profile = {
    id: user.id,
    name: user.name,
    image: user.image,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    karmaScore,
    deedCount: user._count.deeds,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    categoryCounts,
  };

  const deeds = await prisma.deed.findMany({
    where: { authorId: userId },
    take: PAGE_SIZE + 1,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
      reactions: true,
    },
  });

  const hasMore = deeds.length > PAGE_SIZE;
  const items = hasMore ? deeds.slice(0, PAGE_SIZE) : deeds;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];

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
      createdAt: deed.createdAt.toISOString(),
      author: deed.author,
      _count: deed._count,
      reactionCounts,
      userReactions,
    };
  });

  // Fetch joined events
  const participations = await prisma.participant.findMany({
    where: { userId },
    take: PAGE_SIZE + 1,
    orderBy: { createdAt: "desc" },
    include: {
      deed: {
        include: {
          author: { select: { id: true, name: true, image: true, ...(session?.user?.id === userId ? { email: true } : {}) } },
          _count: { select: { participants: true } },
        },
      },
    },
  });

  const hasMoreJoined = participations.length > PAGE_SIZE;
  const joinedItems = hasMoreJoined ? participations.slice(0, PAGE_SIZE) : participations;
  const joinedCursor = hasMoreJoined ? joinedItems[joinedItems.length - 1].id : null;

  // Check which events the user has rated
  const joinedDeedIds = joinedItems.map((p) => p.deed.id);
  const userRatings = joinedDeedIds.length > 0 ? await prisma.rating.findMany({
    where: { userId, deedId: { in: joinedDeedIds } },
    select: { deedId: true, score: true },
  }) : [];
  const ratedMap = new Map(userRatings.map((r) => [r.deedId, r.score]));

  const formattedJoined = joinedItems.map((p) => ({
    participantId: p.id,
    joinedAt: p.createdAt.toISOString(),
    message: p.message,
    isPublic: p.isPublic,
    hasRated: ratedMap.has(p.deed.id),
    userRating: ratedMap.get(p.deed.id) || null,
    deed: {
      id: p.deed.id,
      title: p.deed.title,
      description: p.deed.description,
      category: p.deed.category,
      type: p.deed.type,
      isExample: p.deed.isExample,
      eventDate: p.deed.eventDate?.toISOString() || null,
      eventEndDate: p.deed.eventEndDate?.toISOString() || null,
      meetingPoint: p.deed.meetingPoint,
      whatToBring: p.deed.whatToBring,
      maxSpots: p.deed.maxSpots,
      participantCount: p.deed._count.participants,
      author: {
        id: p.deed.author.id,
        name: p.deed.author.name,
        image: p.deed.author.image,
        email: isOwnProfile ? p.deed.author.email : undefined,
      },
    },
  }));

  return (
    <div className="space-y-6">
      <ProfileHeader user={profile} isOwnProfile={isOwnProfile} />
      <ProfileTabs
        userId={userId}
        initialDeeds={formattedDeeds as never[]}
        initialDeedsCursor={nextCursor}
        initialJoinedEvents={formattedJoined}
        initialJoinedCursor={joinedCursor}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
}
