"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-full hover:bg-[var(--bg-elevated)] p-1 pr-3 transition-all"
      >
        <Avatar name={session.user.name || "U"} image={session.user.image} size="sm" />
        <span className="hidden sm:block text-xs font-medium text-[var(--text-secondary)]">{session.user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/40 py-1 z-50 animate-fade-in">
          <Link
            href={`/profile/${session.user.id}`}
            className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] font-medium transition-colors"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            href="/leaderboard"
            className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] font-medium transition-colors"
            onClick={() => setOpen(false)}
          >
            Leaderboard
          </Link>
          {Boolean((session.user as Record<string, unknown>).isAdmin) && (
            <Link
              href="/admin"
              className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] font-medium transition-colors"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
          <div className="h-px bg-[var(--border)] mx-3" />
          <Link
            href="/impressum"
            className="block px-4 py-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            onClick={() => setOpen(false)}
          >
            Impressum
          </Link>
          <Link
            href="/privacy"
            className="block px-4 py-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            onClick={() => setOpen(false)}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="block px-4 py-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            onClick={() => setOpen(false)}
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <div className="h-px bg-[var(--border)] mx-3" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full text-left px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
