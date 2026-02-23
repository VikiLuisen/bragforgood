import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/constants";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect("/feed");
  }

  return <AdminDashboard />;
}
