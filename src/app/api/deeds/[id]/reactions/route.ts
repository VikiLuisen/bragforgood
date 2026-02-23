import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType } from "@/lib/constants";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deedId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type } = body;

  if (!type || !(type in REACTION_CONFIG)) {
    return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
  }

  const deed = await prisma.deed.findUnique({ where: { id: deedId } });
  if (!deed) {
    return NextResponse.json({ error: "Deed not found" }, { status: 404 });
  }

  // Toggle: if reaction exists, remove it; otherwise create it
  const existing = await prisma.reaction.findUnique({
    where: {
      userId_deedId_type: {
        userId: session.user.id,
        deedId,
        type,
      },
    },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reaction.create({
      data: {
        type,
        userId: session.user.id,
        deedId,
      },
    });
  }

  // Return updated counts
  const reactions = await prisma.reaction.findMany({
    where: { deedId },
  });

  const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];
  const counts: Record<string, number> = {};
  reactionTypes.forEach((t) => {
    counts[t] = reactions.filter((r) => r.type === t).length;
  });

  const userReactions = reactions
    .filter((r) => r.userId === session.user!.id)
    .map((r) => r.type);

  return NextResponse.json({ counts, userReactions });
}
