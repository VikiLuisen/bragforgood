"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("common.back")}
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">{t("legal.impressum.title")}</h1>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.impressum.pursuant")}</h2>
          <p>{t("legal.impressum.name")}</p>
          <p className="mt-1">{t("legal.impressum.email")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.impressum.disclaimerTitle")}</h2>

          <h3 className="font-semibold text-[var(--text-primary)] mt-3 mb-1">{t("legal.impressum.contentTitle")}</h3>
          <p>{t("legal.impressum.contentText")}</p>

          <h3 className="font-semibold text-[var(--text-primary)] mt-3 mb-1">{t("legal.impressum.linksTitle")}</h3>
          <p>{t("legal.impressum.linksText")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.impressum.copyrightTitle")}</h2>
          <p>{t("legal.impressum.copyrightText")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.impressum.lawTitle")}</h2>
          <p>{t("legal.impressum.lawText")}</p>
        </section>
      </div>
    </div>
  );
}
