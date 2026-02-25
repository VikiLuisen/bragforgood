import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendEventJoinConfirmation } from "@/lib/email";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const participants = await prisma.participant.findMany({
    where: { deedId: id },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(
    participants.map((p) => ({
      id: p.id,
      message: p.message,
      createdAt: p.createdAt.toISOString(),
      user: p.user,
    }))
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`join:${session.user.id}`, 20, 3600000)) {
    return NextResponse.json({ error: "Too many requests. Slow down!" }, { status: 429 });
  }

  const { id } = await params;

  const deed = await prisma.deed.findUnique({
    where: { id },
    select: { type: true, title: true, eventDate: true, eventEndDate: true, meetingPoint: true, whatToBring: true, maxSpots: true, authorId: true, _count: { select: { participants: true } } },
  });

  if (!deed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (deed.type !== "CALL_TO_ACTION") {
    return NextResponse.json({ error: "This post is not a Call to Action" }, { status: 400 });
  }

  if (deed.authorId === session.user.id) {
    return NextResponse.json({ error: "You can't join your own event" }, { status: 400 });
  }

  if (deed.eventDate && deed.eventDate < new Date()) {
    return NextResponse.json({ error: "This event has already passed" }, { status: 400 });
  }

  if (deed.maxSpots && deed._count.participants >= deed.maxSpots) {
    return NextResponse.json({ error: "This event is full" }, { status: 400 });
  }

  // Check if already joined
  const existing = await prisma.participant.findUnique({
    where: { userId_deedId: { userId: session.user.id, deedId: id } },
  });

  if (existing) {
    return NextResponse.json({ error: "You've already joined this event" }, { status: 400 });
  }

  let message: string | null = null;
  try {
    const body = await request.json();
    if (body.message && typeof body.message === "string") {
      message = body.message.trim().slice(0, 200);
    }
  } catch {
    // No body or invalid JSON — that's fine, message is optional
  }

  const participant = await prisma.participant.create({
    data: {
      userId: session.user.id,
      deedId: id,
      message: message || null,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  const count = await prisma.participant.count({ where: { deedId: id } });

  // Send confirmation email (fire-and-forget)
  if (deed.eventDate && deed.meetingPoint) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    });
    if (user?.email) {
      sendEventJoinConfirmation({
        to: user.email,
        userName: user.name,
        eventTitle: deed.title,
        eventDate: deed.eventDate,
        eventEndDate: deed.eventEndDate,
        meetingPoint: deed.meetingPoint,
        whatToBring: deed.whatToBring,
        deedId: id,
      }).catch(() => {}); // Don't block the response
    }
  }

  return NextResponse.json({
    participant: {
      id: participant.id,
      message: participant.message,
      createdAt: participant.createdAt.toISOString(),
      user: participant.user,
    },
    participantCount: count,
  }, { status: 201 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.participant.findUnique({
    where: { userId_deedId: { userId: session.user.id, deedId: id } },
  });

  if (!existing) {
    return NextResponse.json({ error: "You haven't joined this event" }, { status: 400 });
  }

  await prisma.participant.delete({
    where: { id: existing.id },
  });

  const count = await prisma.participant.count({ where: { deedId: id } });

  return NextResponse.json({ participantCount: count });
}
