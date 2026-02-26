import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deedId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`report:${session.user.id}`, 10, 86400000)) {
    return NextResponse.json({ error: "Too many reports. Try again later." }, { status: 429 });
  }

  const body = await request.json();
  const reason = body.reason;

  if (!reason || !["not_good_deed", "spam", "offensive", "other"].includes(reason)) {
    return NextResponse.json({ error: "Invalid report reason" }, { status: 400 });
  }

  // Sanitize optional details field
  const details = typeof body.details === "string"
    ? body.details.replace(/<[^>]*>/g, "").trim().slice(0, 500) || null
    : null;

  const deed = await prisma.deed.findUnique({ where: { id: deedId } });
  if (!deed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Check if user already reported this deed
  const existing = await prisma.report.findUnique({
    where: { userId_deedId: { userId: session.user.id, deedId } },
  });

  if (existing) {
    return NextResponse.json({ error: "You already reported this post" }, { status: 409 });
  }

  // Create report and increment flag count
  await prisma.$transaction([
    prisma.report.create({
      data: {
        reason,
        details,
        userId: session.user.id,
        deedId,
      },
    }),
    prisma.deed.update({
      where: { id: deedId },
      data: { flagCount: { increment: 1 } },
    }),
  ]);

  logger.info("report.created", { reporterId: session.user.id, deedId, reason });

  return NextResponse.json({ success: true });
}
