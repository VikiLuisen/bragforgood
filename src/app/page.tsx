import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType, DeedCategory } from "@/lib/constants";
import { LandingContent } from "@/components/landing/landing-content";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/feed");

  // Fetch recent posts for the preview
  const recentDeeds = await prisma.deed.findMany({
    where: { flagCount: { lt: 3 } },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, participants: true } },
      reactions: true,
    },
  });

  const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];

  const previewDeeds = recentDeeds.map((deed) => {
    const reactionCounts = Object.fromEntries(
      reactionTypes.map((type) => [type, deed.reactions.filter((r) => r.type === type).length])
    ) as Record<ReactionType, number>;
    const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

    return {
      id: deed.id,
      title: deed.title,
      description: deed.description,
      category: deed.category as DeedCategory,
      type: deed.type,
      authorName: deed.author.name,
      authorImage: deed.author.image,
      createdAt: deed.createdAt.toISOString(),
      photoUrls: deed.photoUrls,
      location: deed.location,
      eventDate: deed.eventDate?.toISOString() ?? null,
      meetingPoint: deed.meetingPoint,
      commentCount: deed._count.comments,
      participantCount: deed._count.participants,
      totalReactions,
      reactionCounts,
      isExample: deed.isExample,
    };
  });

  return <LandingContent previewDeeds={previewDeeds} />;
}
