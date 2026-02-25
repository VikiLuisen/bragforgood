import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EditDeedForm } from "@/components/deeds/edit-deed-form";

export default async function EditDeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const deed = await prisma.deed.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      photoUrls: true,
      location: true,
      authorId: true,
    },
  });

  if (!deed) notFound();
  if (deed.authorId !== session.user.id) redirect(`/deeds/${id}`);

  return (
    <EditDeedForm
      deed={{
        id: deed.id,
        title: deed.title,
        description: deed.description,
        category: deed.category,
        photoUrls: deed.photoUrls,
        location: deed.location,
      }}
    />
  );
}
