import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost, blogPosts } from "@/content/blog";
import { ContentRenderer } from "@/components/blog/content-renderer";
import { ReferencesSection } from "@/components/blog/references-section";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: `${post.title} | bragforgood`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "bragforgood",
    },
    publisher: {
      "@type": "Organization",
      name: "bragforgood",
    },
  };

  return (
    <div className="animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All articles
      </Link>

      <article className="card p-6">
        <div className="-mx-6 -mt-6 mb-6 aspect-[2.4/1] overflow-hidden rounded-t-[15px]">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(52,211,153,0.15)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-xl font-bold text-[var(--text-primary)] leading-snug">{post.title}</h1>

        <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text-tertiary)]">
          <span>{post.author}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
          <span>{publishedDate}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]" />
          <span>{post.readingTimeMinutes} min read</span>
        </div>

        <div className="mt-8">
          <ContentRenderer blocks={post.content} />
        </div>

        {post.references.length > 0 && (
          <ReferencesSection references={post.references} />
        )}
      </article>

      <div className="card p-6 mt-4 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Inspired by the science?{" "}
          <Link href="/sign-up" className="text-[var(--accent)] font-bold hover:underline">
            Join bragforgood
          </Link>{" "}
          and start bragging about your good deeds.
        </p>
      </div>
    </div>
  );
}
