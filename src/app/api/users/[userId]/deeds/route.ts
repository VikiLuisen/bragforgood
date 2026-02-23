import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE, REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit")) || PAGE_SIZE, 50);

  const deeds = await prisma.deed.findMany({
    where: { authorId: userId },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
      reactions: true,
    },
  });

  const hasMore = deeds.length > limit;
  const items = hasMore ? deeds.slice(0, limit) : deeds;
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
      photoUrl: deed.photoUrl,
      location: deed.location,
      createdAt: deed.createdAt.toISOString(),
      author: deed.author,
      _count: deed._count,
      reactionCounts,
      userReactions,
    };
  });

  return NextResponse.json({ items: formattedDeeds, nextCursor });
}
