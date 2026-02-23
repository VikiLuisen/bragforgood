import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validations/comment";
import { moderateComment } from "@/lib/moderation";
import { PAGE_SIZE } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: deedId } = await params;
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit")) || PAGE_SIZE, 50);

  const comments = await prisma.comment.findMany({
    where: { deedId },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const hasMore = comments.length > limit;
  const items = hasMore ? comments.slice(0, limit) : comments;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return NextResponse.json({
    items: items.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
      user: c.user,
    })),
    nextCursor,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deedId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`comment:${session.user.id}`, 20, 3600000)) {
    return NextResponse.json({ error: "Too many comments. Slow down!" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = createCommentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const deed = await prisma.deed.findUnique({ where: { id: deedId } });
  if (!deed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // AI moderation check
  const moderation = await moderateComment(parsed.data.body);
  if (!moderation.approved) {
    return NextResponse.json(
      { error: moderation.reason || "This comment doesn't meet our community guidelines.", moderation: true },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      body: parsed.data.body,
      userId: session.user.id,
      deedId,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(
    {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      user: comment.user,
    },
    { status: 201 }
  );
}
