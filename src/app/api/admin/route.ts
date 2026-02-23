import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_EMAIL } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!rateLimit(`admin:${session.user.id}`, 30, 3600000)) {
    return NextResponse.json({ error: "Too many admin requests" }, { status: 429 });
  }

  const [users, posts, reactionCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: { select: { deeds: true } },
      },
    }),
    prisma.deed.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        flagCount: true,
        isExample: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
        _count: { select: { comments: true, reactions: true } },
      },
    }),
    prisma.reaction.count(),
  ]);

  // Compute karma per user (count of reactions on their deeds)
  const karmaByUser = await prisma.reaction.groupBy({
    by: ["deedId"],
    _count: true,
  });

  const deedAuthors = await prisma.deed.findMany({
    select: { id: true, authorId: true },
  });

  const authorDeedMap = new Map<string, string>();
  deedAuthors.forEach((d) => authorDeedMap.set(d.id, d.authorId));

  const karmaScores = new Map<string, number>();
  karmaByUser.forEach(({ deedId, _count }) => {
    const authorId = authorDeedMap.get(deedId);
    if (authorId) {
      karmaScores.set(authorId, (karmaScores.get(authorId) || 0) + _count);
    }
  });

  const usersWithKarma = users.map((u) => ({
    ...u,
    postCount: u._count.deeds,
    karmaScore: karmaScores.get(u.id) || 0,
  }));

  const formattedPosts = posts.map((p) => ({
    ...p,
    commentCount: p._count.comments,
    reactionCount: p._count.reactions,
  }));

  return NextResponse.json({
    users: usersWithKarma,
    posts: formattedPosts,
    stats: {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalReactions: reactionCount,
    },
  });
}
