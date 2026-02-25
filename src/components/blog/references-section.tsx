import type { Citation } from "@/content/blog/types";

export function ReferencesSection({ references }: { references: Citation[] }) {
  return (
    <section className="mt-10 pt-8 border-t border-[var(--border)]">
      <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">
        References
      </h2>
      <ol className="list-decimal pl-5 space-y-2">
        {references.map((ref, i) => (
          <li key={i} className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            {ref.authors} ({ref.year}). <em>{ref.title}</em>. {ref.journal}.
            {ref.doi && (
              <>
                {" "}
                <a
                  href={`https://doi.org/${ref.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  https://doi.org/{ref.doi}
                </a>
              </>
            )}
            {ref.url && !ref.doi && (
              <>
                {" "}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  Link
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
