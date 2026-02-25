import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/constants";

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

  const participations = await prisma.participant.findMany({
    where: { userId },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      deed: {
        include: {
          author: { select: { id: true, name: true, image: true, email: true } },
          _count: { select: { participants: true } },
        },
      },
    },
  });

  const hasMore = participations.length > limit;
  const items = hasMore ? participations.slice(0, limit) : participations;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  // Check which events the user has already rated
  const deedIds = items.map((p) => p.deed.id);
  const userRatings = await prisma.rating.findMany({
    where: { userId, deedId: { in: deedIds } },
    select: { deedId: true, score: true },
  });
  const ratedMap = new Map(userRatings.map((r) => [r.deedId, r.score]));

  const formattedItems = items.map((p) => ({
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
        // Only include email if viewing own joined events
        email: userId === session.user?.id ? p.deed.author.email : undefined,
      },
    },
  }));

  return NextResponse.json({ items: formattedItems, nextCursor });
}
