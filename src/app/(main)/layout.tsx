import { Navbar } from "@/components/layout/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-glow">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 relative z-10">{children}</main>
    </div>
  );
}
