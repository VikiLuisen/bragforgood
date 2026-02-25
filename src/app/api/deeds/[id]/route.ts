import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDeedSchema } from "@/lib/validations/deed";
import { REACTION_CONFIG } from "@/lib/constants";
import type { ReactionType } from "@/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  const deed = await prisma.deed.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
      reactions: true,
    },
  });

  if (!deed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];
  const reactionCounts: Record<string, number> = {};
  reactionTypes.forEach((type) => {
    reactionCounts[type] = deed.reactions.filter((r) => r.type === type).length;
  });

  const userReactions = session?.user?.id
    ? deed.reactions
        .filter((r) => r.userId === session.user!.id)
        .map((r) => r.type)
    : [];

  return NextResponse.json({
    id: deed.id,
    title: deed.title,
    description: deed.description,
    category: deed.category,
    photoUrls: deed.photoUrls,
    location: deed.location,
    createdAt: deed.createdAt.toISOString(),
    author: deed.author,
    _count: deed._count,
    reactionCounts,
    userReactions,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deed = await prisma.deed.findUnique({ where: { id } });

  if (!deed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (deed.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const { title, description, category, photoUrls, location } = parsed.data;

    const updated = await prisma.deed.update({
      where: { id },
      data: {
        title,
        description,
        category,
        photoUrls: photoUrls || [],
        location: location || null,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deed = await prisma.deed.findUnique({ where: { id } });

  if (!deed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (deed.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.deed.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
