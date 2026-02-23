import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/feed");

  return (
    <div className="min-h-screen bg-glow flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full relative z-10">
        <Logo size="md" href="/" />
        <Link
          href="/sign-in"
          className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Sign In
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-dim)] border border-[rgba(52,211,153,0.2)] text-[var(--accent)] text-xs font-semibold mb-10 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            Humble? Overrated.
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.05]">
            Wait, you&apos;re
            <br />
            <span className="text-gradient">bragging?</span>
          </h1>

          <p className="text-2xl sm:text-3xl font-bold text-[var(--text-secondary)] mt-4">
            Yeah, but for <span className="text-[var(--accent)]">good.</span>
          </p>

          <p className="text-base text-[var(--text-tertiary)] mt-6 max-w-md mx-auto leading-relaxed">
            The only place where showing off makes the world better.
            Did something good? Don&apos;t be shy. Tell everyone.
          </p>

          <div className="flex gap-3 justify-center mt-12">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent)] text-[#0a0a0b] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[rgba(52,211,153,0.25)] hover:shadow-xl hover:shadow-[rgba(52,211,153,0.35)]"
            >
              Start bragging
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center px-8 py-3.5 rounded-full border border-[var(--border-light)] text-[var(--text-secondary)] font-semibold text-sm hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all hover:bg-[var(--accent-dim)]"
            >
              I already brag here
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 mt-16">
            <div className="flex -space-x-2.5">
              {["from-emerald-400 to-teal-500", "from-blue-400 to-indigo-500", "from-purple-400 to-pink-500", "from-amber-400 to-orange-500", "from-rose-400 to-red-500"].map((gradient, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} border-2 border-[var(--bg)] flex items-center justify-center text-white text-[9px] font-bold shadow-lg`}
                >
                  {["AM", "MC", "LC", "RP", "SD"][i]}
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] font-medium">
              Shameless do-gooders worldwide
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
