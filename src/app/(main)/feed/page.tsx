import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { DeedFeed } from "@/components/deeds/deed-feed";
import { RotatingTagline } from "@/components/deeds/rotating-tagline";
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
      _count: { select: { comments: true } },
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
      photoUrl: deed.photoUrl,
      location: deed.location,
      isExample: deed.isExample,
      createdAt: deed.createdAt.toISOString(),
      author: {
        ...deed.author,
        karmaScore: karmaMap[deed.author.id] || 0,
      },
      _count: deed._count,
      reactionCounts,
      userReactions,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">The Brag Board</h1>
          <RotatingTagline />
        </div>
        <Link
          href="/deeds/new"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-[#0a0a0b] text-sm font-bold hover:brightness-110 transition-all shadow-md shadow-[rgba(52,211,153,0.2)] hover:shadow-lg hover:shadow-[rgba(52,211,153,0.35)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Brag
        </Link>
      </div>
      <DeedFeed
        initialDeeds={formattedDeeds as never[]}
        initialCursor={nextCursor}
        sessionUserId={session?.user?.id}
      />
    </div>
  );
}
