import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-glow flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 relative z-10 flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
