"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[var(--text-tertiary)]">
          <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">
            {t("footer.blog")}
          </Link>
          <Link href="/impressum" className="hover:text-[var(--accent)] transition-colors">
            {t("footer.impressum")}
          </Link>
          <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
            {t("footer.privacy")}
          </Link>
          <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">
            {t("footer.terms")}
          </Link>
          <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">
            {t("footer.contact")}
          </Link>
        </div>
        <p className="text-center text-[10px] text-[var(--text-tertiary)] mt-4 opacity-60">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
