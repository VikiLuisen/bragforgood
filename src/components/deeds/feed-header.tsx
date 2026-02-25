"use client";

import Link from "next/link";
import { RotatingTagline } from "./rotating-tagline";
import { useTranslation } from "@/lib/useTranslation";

interface FeedHeaderProps {
  isGuest: boolean;
  isLoggedIn: boolean;
}

export function FeedHeader({ isGuest, isLoggedIn }: FeedHeaderProps) {
  const { t } = useTranslation();

  return (
    <>
      {isGuest && (
        <div className="mb-6 p-4 rounded-xl bg-[var(--accent-dim)] border border-[rgba(52,211,153,0.2)] text-center">
          <p className="text-sm text-[var(--text-primary)] font-medium">
            {t("feed.guestBanner").split("{signUpLink}")[0]}
            <Link href="/sign-up" className="text-[var(--accent)] font-bold hover:underline">
              {t("feed.signUpLink")}
            </Link>
            {t("feed.guestBanner").split("{signUpLink}")[1]}
          </p>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t("feed.title")}</h1>
          <RotatingTagline />
        </div>
        {isLoggedIn && (
          <Link
            href="/deeds/new"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-[#0a0a0b] text-sm font-bold hover:brightness-110 transition-all shadow-md shadow-[rgba(52,211,153,0.2)] hover:shadow-lg hover:shadow-[rgba(52,211,153,0.35)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t("feed.brag")}
          </Link>
        )}
      </div>
    </>
  );
}
