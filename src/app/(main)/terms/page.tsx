import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Terms of Service</h1>
      <p className="text-xs text-[var(--text-tertiary)] mb-8">Last updated: February 23, 2026</p>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">1. Acceptance of terms</h2>
          <p>
            By creating an account or using bragforgood, you agree to these Terms of Service. If you do not agree,
            please do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">2. What bragforgood is</h2>
          <p>
            bragforgood is a social platform where users share good deeds and positive actions. The platform is
            operated by Claudia Hilti and is provided as-is, free of charge.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">3. Your account</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for keeping your password secure</li>
            <li>You must be at least 16 years old to use bragforgood</li>
            <li>One account per person</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">4. Content guidelines</h2>
          <p>When posting on bragforgood, you agree to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Only share genuine good deeds and positive actions</li>
            <li>Not post spam, offensive, hateful, or misleading content</li>
            <li>Not impersonate others or post on behalf of someone without permission</li>
            <li>Respect other users in comments and interactions</li>
          </ul>
          <p className="mt-2">
            Content is reviewed by AI moderation. Posts or comments that violate these guidelines may be rejected or
            removed. Users who repeatedly violate guidelines may have their accounts suspended.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">5. Community reporting</h2>
          <p>
            Users can report posts they believe violate our guidelines. Posts that receive multiple reports may be
            hidden from the feed. We review reports and take action as appropriate.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">6. Your content</h2>
          <p>
            You retain ownership of the content you post on bragforgood. By posting, you grant us a non-exclusive
            license to display your content on the platform. You can delete your content at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">7. Limitation of liability</h2>
          <p>
            bragforgood is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
            damages arising from your use of the platform. We do not guarantee uninterrupted or error-free service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">8. Governing law</h2>
          <p>
            These terms are governed by the laws of Switzerland. Users from other countries are additionally subject
            to their local consumer protection laws where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">9. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform after changes constitutes
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">10. Contact</h2>
          <p>
            For questions about these terms, contact us at contact@bragforgood.com.
          </p>
        </section>
      </div>
    </div>
  );
}
