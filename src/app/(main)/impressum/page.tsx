import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Impressum / Legal Notice</h1>

      <div className="card p-6 space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Information pursuant to § 5 TMG (Germany) / Art. 3 UWG (Switzerland)</h2>
          <p>Claudia Hilti</p>
          <p className="mt-1">E-Mail: contact@bragforgood.com</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Disclaimer of liability</h2>

          <h3 className="font-semibold text-[var(--text-primary)] mt-3 mb-1">Content</h3>
          <p>
            The contents of this website have been created with the utmost care. However, we cannot guarantee the
            accuracy, completeness, or timeliness of the content. As a service provider, we are responsible for our own
            content on these pages in accordance with applicable national and international laws. However, we are not
            obligated to monitor transmitted or stored third-party information or to investigate circumstances that
            indicate illegal activity.
          </p>

          <h3 className="font-semibold text-[var(--text-primary)] mt-3 mb-1">External links</h3>
          <p>
            Our website may contain links to external websites of third parties, over whose content we have no
            influence. Therefore, we cannot accept any liability for this third-party content. The respective provider
            or operator of the linked pages is always responsible for the content of those pages.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Copyright</h2>
          <p>
            The content and works created by the site operator on these pages are subject to copyright law. Duplication,
            processing, distribution, or any form of commercialization of such material beyond the scope of copyright
            law requires the prior written consent of the respective author or creator. This applies under the laws of
            Germany, Switzerland, the European Union, and all applicable international copyright conventions (including
            the Berne Convention and WIPO treaties).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Governing law</h2>
          <p>
            This legal notice complies with German law (Telemediengesetz, TMG) and Swiss law (Bundesgesetz gegen den
            unlauteren Wettbewerb, UWG). For users outside of these jurisdictions, all applicable local laws also apply.
          </p>
        </section>
      </div>
    </div>
  );
}
