"use client";

import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { UserMenu } from "./user-menu";
import { LanguageSelector } from "./language-selector";

export function Navbar() {
  const { data: session } = useSession();

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
              href="/blog"
              className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
            >
              Blog
            </Link>
            {session?.user && (
              <Link
                href="/deeds/new"
                className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-all"
              >
                + Brag
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <LanguageSelector />
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-1.5 rounded-full text-[13px] font-bold bg-[var(--accent)] text-[#0a0a0b] hover:brightness-110 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
