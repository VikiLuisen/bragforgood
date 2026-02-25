"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("common.back")}
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">{t("legal.contact.title")}</h1>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.contact.getInTouch")}</h2>
          <p>{t("legal.contact.intro")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.contact.email")}</h2>
          <a
            href="mailto:contact@bragforgood.com"
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:brightness-110 font-medium transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            contact@bragforgood.com
          </a>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.contact.dataRequests")}</h2>
          <p>{t("legal.contact.dataRequestsText")}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">{t("legal.contact.reportProblem")}</h2>
          <p>{t("legal.contact.reportProblemText")}</p>
        </section>
      </div>
    </div>
  );
}
