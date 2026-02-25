"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("common.back")}
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t("legal.privacy.title")}</h1>
      <p className="text-xs text-[var(--text-tertiary)] mb-8">{t("legal.privacy.lastUpdated")}</p>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section1Title")}</h2>
          <p>{t("legal.privacy.section1Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section2Title")}</h2>
          <p>{t("legal.privacy.section2Intro")}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>{t("legal.privacy.section2Account")}</strong> {t("legal.privacy.section2AccountText")}</li>
            <li><strong>{t("legal.privacy.section2Content")}</strong> {t("legal.privacy.section2ContentText")}</li>
            <li><strong>{t("legal.privacy.section2Profile")}</strong> {t("legal.privacy.section2ProfileText")}</li>
            <li><strong>{t("legal.privacy.section2Usage")}</strong> {t("legal.privacy.section2UsageText")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section3Title")}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t("legal.privacy.section3Item1")}</li>
            <li>{t("legal.privacy.section3Item2")}</li>
            <li>{t("legal.privacy.section3Item3")}</li>
            <li>{t("legal.privacy.section3Item4")}</li>
            <li>{t("legal.privacy.section3Item5")}</li>
            <li>{t("legal.privacy.section3Item6")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section4Title")}</h2>
          <p>{t("legal.privacy.section4Intro")}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>{t("legal.privacy.section4Neon")}</strong> {t("legal.privacy.section4NeonText")}</li>
            <li><strong>{t("legal.privacy.section4Vercel")}</strong> {t("legal.privacy.section4VercelText")}</li>
            <li><strong>{t("legal.privacy.section4Anthropic")}</strong> {t("legal.privacy.section4AnthropicText")}</li>
            <li><strong>{t("legal.privacy.section4Resend")}</strong> {t("legal.privacy.section4ResendText")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section5Title")}</h2>
          <p>{t("legal.privacy.section5Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section6Title")}</h2>
          <p>{t("legal.privacy.section6Intro")}</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{t("legal.privacy.section6Item1")}</li>
            <li>{t("legal.privacy.section6Item2")}</li>
            <li>{t("legal.privacy.section6Item3")}</li>
            <li>{t("legal.privacy.section6Item4")}</li>
            <li>{t("legal.privacy.section6Item5")}</li>
            <li>{t("legal.privacy.section6Item6")}</li>
          </ul>
          <p className="mt-2">{t("legal.privacy.section6Gdpr")}</p>
          <p className="mt-2">{t("legal.privacy.section6Contact")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section7Title")}</h2>
          <p>{t("legal.privacy.section7Text")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.privacy.section8Title")}</h2>
          <p>{t("legal.privacy.section8Text")}</p>
        </section>
      </div>
    </div>
  );
}
