import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: { select: { deeds: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const karmaScore = await prisma.reaction.count({
    where: { deed: { authorId: userId } },
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    image: user.image,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    karmaScore,
    deedCount: user._count.deeds,
  });
}
