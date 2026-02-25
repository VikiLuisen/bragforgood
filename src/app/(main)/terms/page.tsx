"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("common.back")}
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t("legal.terms.title")}</h1>
      <p className="text-xs text-[var(--text-tertiary)] mb-8">{t("legal.terms.lastUpdated")}</p>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section1Title")}</h2>
          <p>{t("legal.terms.section1Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section2Title")}</h2>
          <p>{t("legal.terms.section2Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section3Title")}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t("legal.terms.section3Item1")}</li>
            <li>{t("legal.terms.section3Item2")}</li>
            <li>{t("legal.terms.section3Item3")}</li>
            <li>{t("legal.terms.section3Item4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section4Title")}</h2>
          <p>{t("legal.terms.section4Intro")}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t("legal.terms.section4Item1")}</li>
            <li>{t("legal.terms.section4Item2")}</li>
            <li>{t("legal.terms.section4Item3")}</li>
            <li>{t("legal.terms.section4Item4")}</li>
          </ul>
          <p className="mt-2">{t("legal.terms.section4Moderation")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section5Title")}</h2>
          <p>{t("legal.terms.section5Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section6Title")}</h2>
          <p>{t("legal.terms.section6Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section7Title")}</h2>
          <p>{t("legal.terms.section7Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section8Title")}</h2>
          <p>{t("legal.terms.section8Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section9Title")}</h2>
          <p>{t("legal.terms.section9Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.terms.section10Title")}</h2>
          <p>{t("legal.terms.section10Text")}</p>
        </section>
      </div>
    </div>
  );
}
