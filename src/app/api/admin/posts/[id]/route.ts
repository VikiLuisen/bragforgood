import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_EMAIL } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!rateLimit(`admin:${session.user.id}`, 30, 3600000)) {
    return NextResponse.json({ error: "Too many admin requests" }, { status: 429 });
  }

  const { id } = await params;

  const deed = await prisma.deed.findUnique({ where: { id } });
  if (!deed) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.deed.delete({ where: { id } });

  logger.info("admin.post_deleted", { adminEmail: session.user.email, postId: id });

  return NextResponse.json({ success: true });
}
