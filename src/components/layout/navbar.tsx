import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { UserMenu } from "./user-menu";
import { LanguageSelector } from "./language-selector";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo size="md" href="/feed" />
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/feed"
              className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            >
              Feed
            </Link>
            <Link
              href="/deeds/new"
              className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all"
            >
              + Brag
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
