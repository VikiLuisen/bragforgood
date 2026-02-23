import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Contact</h1>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Get in touch</h2>
          <p>
            Have a question, feedback, or need help? We&apos;d love to hear from you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Email</h2>
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
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Data requests</h2>
          <p>
            To request access to, correction, or deletion of your personal data under GDPR, email us at
            contact@bragforgood.com. We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Report a problem</h2>
          <p>
            Found a bug or something not working right? Let us know at contact@bragforgood.com and we&apos;ll look into it.
          </p>
        </section>
      </div>
    </div>
  );
}
