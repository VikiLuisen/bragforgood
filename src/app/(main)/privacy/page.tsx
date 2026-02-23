import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Privacy Policy</h1>
      <p className="text-xs text-[var(--text-tertiary)] mb-8">Last updated: February 23, 2026</p>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">1. Who we are</h2>
          <p>
            bragforgood is operated by Viktoria Luisen. For questions about this privacy policy, contact us at
            contact@bragforgood.com.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">2. Data we collect</h2>
          <p>When you use bragforgood, we collect:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Account information:</strong> name, email address, and password (stored securely hashed)</li>
            <li><strong>Content you create:</strong> deeds (posts), comments, and reactions</li>
            <li><strong>Profile information:</strong> bio and profile picture (optional)</li>
            <li><strong>Usage data:</strong> language preference</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">3. How we use your data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and maintain the platform</li>
            <li>To authenticate your account</li>
            <li>To display your posts and profile to other users</li>
            <li>To moderate content using AI (posts and comments are reviewed for community guideline compliance)</li>
            <li>To translate content when requested</li>
            <li>To send password reset emails when you request them</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">4. Third-party services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Neon:</strong> database hosting (your data is stored securely)</li>
            <li><strong>Vercel:</strong> website hosting</li>
            <li><strong>Anthropic (Claude):</strong> AI content moderation and translation (your post/comment text is sent for review)</li>
            <li><strong>Resend:</strong> transactional emails (password resets)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">5. Data retention</h2>
          <p>
            We keep your data as long as your account is active. If you want your account and data deleted, contact us
            at contact@bragforgood.com and we will remove it within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">6. Your rights (GDPR)</h2>
          <p>As a user in the EU, you have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request data portability</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at contact@bragforgood.com.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">7. Cookies</h2>
          <p>
            We use only essential cookies required for authentication (session cookies). We do not use tracking cookies
            or analytics cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">8. Changes to this policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify users of significant changes by posting
            a notice on the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
