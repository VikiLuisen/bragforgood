import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ratings = await prisma.rating.findMany({
    where: { deedId: id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  const avg = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
    : 0;

  return NextResponse.json({
    ratings: ratings.map((r) => ({
      id: r.id,
      score: r.score,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      user: r.user,
    })),
    averageScore: Math.round(avg * 10) / 10,
    count: ratings.length,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`rate:${session.user.id}`, 20, 3600000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  const body = await request.json();
  const score = body.score;
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 500) || null : null;

  if (!score || !Number.isInteger(score) || score < 1 || score > 5) {
    return NextResponse.json({ error: "Score must be 1-5" }, { status: 400 });
  }

  const deed = await prisma.deed.findUnique({
    where: { id },
    select: { type: true, eventDate: true },
  });

  if (!deed || deed.type !== "CALL_TO_ACTION") {
    return NextResponse.json({ error: "Not a Call to Action" }, { status: 400 });
  }

  if (!deed.eventDate || deed.eventDate > new Date()) {
    return NextResponse.json({ error: "Event hasn't passed yet" }, { status: 400 });
  }

  const participation = await prisma.participant.findUnique({
    where: { userId_deedId: { userId: session.user.id, deedId: id } },
  });
  if (!participation) {
    return NextResponse.json({ error: "Only participants can rate events" }, { status: 403 });
  }

  const existing = await prisma.rating.findUnique({
    where: { userId_deedId: { userId: session.user.id, deedId: id } },
  });
  if (existing) {
    return NextResponse.json({ error: "You've already rated this event" }, { status: 400 });
  }

  const rating = await prisma.rating.create({
    data: { score, comment, userId: session.user.id, deedId: id },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({
    id: rating.id,
    score: rating.score,
    comment: rating.comment,
    createdAt: rating.createdAt.toISOString(),
    user: rating.user,
  }, { status: 201 });
}
