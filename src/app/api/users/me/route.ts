import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations/auth";
import { logger } from "@/lib/logger";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 });
    }

    const { name, bio, image } = parsed.data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio: bio || null,
        image: image ?? undefined,
      },
      select: { id: true, name: true, bio: true, image: true },
    });

    return NextResponse.json(user);
  } catch (err) {
    logger.error("profile.update_error", { error: String(err) });
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cascade delete is configured in schema — deleting user removes all their data
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("account.deletion_error", { error: String(err) });
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
