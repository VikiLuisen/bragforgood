import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDeedSchema } from "@/lib/validations/deed";
import { moderateDeed } from "@/lib/moderation";
import { PAGE_SIZE, REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor");
  const category = searchParams.get("category");
  const limit = Math.min(Number(searchParams.get("limit")) || PAGE_SIZE, 50);

  const where = {
    ...(category ? { category } : {}),
    flagCount: { lt: 3 },
  };

  const deeds = await prisma.deed.findMany({
    where,
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

  // Fetch karma scores for authors
  const authorIds = [...new Set(items.map((d) => d.author.id))];
  const karmaCounts = await Promise.all(
    authorIds.map(async (id) => ({
      id,
      karma: await prisma.reaction.count({ where: { deed: { authorId: id } } }),
    }))
  );
  const karmaMap = Object.fromEntries(karmaCounts.map((k) => [k.id, k.karma]));

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
      author: { ...deed.author, karmaScore: karmaMap[deed.author.id] || 0 },
      _count: deed._count,
      reactionCounts,
      userReactions,
    };
  });

  return NextResponse.json({ items: formattedDeeds, nextCursor });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`deed:${session.user.id}`, 10, 3600000)) {
    return NextResponse.json({ error: "Too many posts. Slow down!" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = createDeedSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, category, photoUrl, location } = parsed.data;

    // AI moderation check
    const moderation = await moderateDeed(title, description, category);
    if (!moderation.approved) {
      return NextResponse.json(
        { error: moderation.reason || "This post doesn't appear to be about a good deed. Try again!", moderation: true },
        { status: 400 }
      );
    }

    const deed = await prisma.deed.create({
      data: {
        title,
        description,
        category,
        photoUrl: photoUrl || null,
        location: location || null,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });

    // Update posting streak
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { lastDeedDate: true, currentStreak: true, longestStreak: true },
      });

      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let newStreak = user.currentStreak;

        if (user.lastDeedDate) {
          const lastDate = new Date(user.lastDeedDate);
          lastDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak = user.currentStreak + 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
          // diffDays === 0: already posted today, keep current streak
        } else {
          newStreak = 1;
        }

        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, user.longestStreak),
            lastDeedDate: today,
          },
        });
      }
    } catch (e) {
      console.error("Streak update error:", e);
    }

    return NextResponse.json(deed, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
