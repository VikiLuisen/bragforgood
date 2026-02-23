import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge } from "@/components/deeds/category-badge";
import { ReportButton } from "@/components/deeds/report-button";
import { PostActions } from "@/components/deeds/post-actions";
import { ShareButton } from "@/components/deeds/share-button";
import { ReactionBar } from "@/components/reactions/reaction-bar";
import { CommentList } from "@/components/comments/comment-list";
import { CommentForm } from "@/components/comments/comment-form";
import { formatDate } from "@/lib/utils";
import { REACTION_CONFIG, PAGE_SIZE } from "@/lib/constants";
import type { ReactionType, DeedCategory } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const deed = await prisma.deed.findUnique({
    where: { id },
    select: { title: true, description: true, photoUrl: true, author: { select: { name: true } } },
  });

  if (!deed) return { title: "Post not found" };

  const description = deed.description.length > 160
    ? deed.description.slice(0, 157) + "..."
    : deed.description;

  return {
    title: deed.title,
    description: `${deed.author.name}: ${description}`,
    openGraph: {
      title: deed.title,
      description: `${deed.author.name}: ${description}`,
      ...(deed.photoUrl && { images: [{ url: deed.photoUrl }] }),
    },
  };
}

export default async function DeedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const deed = await prisma.deed.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
      reactions: true,
      comments: {
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!deed) notFound();

  const reactionTypes = Object.keys(REACTION_CONFIG) as ReactionType[];
  const reactionCounts: Record<string, number> = {};
  reactionTypes.forEach((type) => {
    reactionCounts[type] = deed.reactions.filter((r) => r.type === type).length;
  });

  const userReactions = session?.user?.id
    ? deed.reactions
        .filter((r) => r.userId === session.user!.id)
        .map((r) => r.type)
    : [];

  const formattedComments = deed.comments.map((c) => ({
    id: c.id,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
    user: c.user,
  }));

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Back button */}
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors font-medium">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to the board
      </Link>

      {/* Deed content */}
      <article className="card p-6">
        <div className="flex items-start gap-3.5">
          <Link href={`/profile/${deed.author.id}`} className="shrink-0">
            <Avatar name={deed.author.name} image={deed.author.image} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${deed.author.id}`}
                className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors text-sm"
              >
                {deed.author.name}
              </Link>
              <span className="text-[11px] text-[var(--text-tertiary)] font-medium">
                {formatDate(deed.createdAt)}
              </span>
              {deed.isExample && (
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(52,211,153,0.15)]">
                  Example
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-[var(--text-primary)] mt-3 leading-snug">{deed.title}</h1>
            <p className="text-[var(--text-secondary)] mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{deed.description}</p>

            <div className="flex items-center gap-2 mt-4">
              <CategoryBadge category={deed.category as DeedCategory} />
              {deed.location && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {deed.location}
                </span>
              )}
            </div>

            {deed.photoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden relative">
                <img
                  src={deed.photoUrl}
                  alt={deed.title}
                  className="w-full max-h-96 object-cover"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <ReactionBar
                deedId={deed.id}
                initialCounts={reactionCounts}
                initialUserReactions={userReactions}
              />
              <ShareButton deedId={deed.id} title={deed.title} />
              <ReportButton deedId={deed.id} />
              <PostActions deedId={deed.id} authorId={deed.author.id} sessionUserId={session?.user?.id} />
            </div>
          </div>
        </div>
      </article>

      {/* Comments */}
      <div className="card p-6">
        <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">
          Comments ({deed._count.comments})
        </h2>
        {session?.user && <CommentForm deedId={deed.id} />}
        <CommentList
          deedId={deed.id}
          initialComments={formattedComments}
          totalCount={deed._count.comments}
        />
      </div>
    </div>
  );
}
