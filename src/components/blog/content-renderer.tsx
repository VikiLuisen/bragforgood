import type { ContentBlock, Citation } from "@/content/blog/types";

function CitationBlock({ citation, context }: { citation: Citation; context: string }) {
  return (
    <blockquote className="my-6 pl-4 border-l-2 border-[var(--accent)] bg-[var(--accent-dim)] rounded-r-xl p-4">
      <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed italic">
        {context}
      </p>
      <footer className="mt-2 text-xs text-[var(--text-tertiary)]">
        {citation.authors} ({citation.year}).{" "}
        <em>{citation.title}</em>. {citation.journal}.
        {citation.doi && (
          <a
            href={`https://doi.org/${citation.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline ml-1"
          >
            DOI
          </a>
        )}
        {citation.url && !citation.doi && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline ml-1"
          >
            Source
          </a>
        )}
      </footer>
    </blockquote>
  );
}

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="text-[var(--text-secondary)] text-[15px] leading-relaxed">
                {block.text}
              </p>
            );
          case "heading": {
            const Tag = block.level === 2 ? "h2" : "h3";
            return (
              <Tag
                key={i}
                className={
                  block.level === 2
                    ? "text-lg font-bold text-[var(--text-primary)] mt-8 mb-3"
                    : "text-base font-semibold text-[var(--text-primary)] mt-6 mb-2"
                }
              >
                {block.text}
              </Tag>
            );
          }
          case "citation":
            return <CitationBlock key={i} citation={block.citation} context={block.context} />;
          case "pullQuote":
            return (
              <div key={i} className="my-8 text-center px-6">
                <p className="text-xl font-bold text-[var(--accent)] leading-snug">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.attribution && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">&mdash; {block.attribution}</p>
                )}
              </div>
            );
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={i}
                className={`${block.ordered ? "list-decimal" : "list-disc"} pl-5 space-y-1.5 text-[var(--text-secondary)] text-[15px] leading-relaxed`}
              >
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ListTag>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
