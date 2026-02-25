import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "The Science of Good | bragforgood",
  description:
    "Science-backed articles about prosocial behavior, the neuroscience of helping others, loneliness, and in-person connection.",
  openGraph: {
    title: "The Science of Good | bragforgood",
    description:
      "Science-backed articles about prosocial behavior, the neuroscience of helping others, loneliness, and in-person connection.",
  },
};

export default function BlogListPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          The Science of Good
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Research-backed reasons why bragging for good is actually good for you.
        </p>
      </div>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <article className="card p-0 overflow-hidden feed-item">
              <div className="aspect-[2.4/1] overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(52,211,153,0.15)]"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {post.readingTimeMinutes} min read
                  </span>
                </div>
                <h2 className="text-base font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
