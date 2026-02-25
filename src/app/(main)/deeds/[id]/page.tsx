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
import { JoinButton } from "@/components/deeds/join-button";
import { ReactionBar } from "@/components/reactions/reaction-bar";
import { CommentList } from "@/components/comments/comment-list";
import { CommentForm } from "@/components/comments/comment-form";
import { formatDate, formatEventDate } from "@/lib/utils";
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
    select: { title: true, description: true, photoUrls: true, author: { select: { name: true } } },
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
      ...(deed.photoUrls.length > 0 && { images: [{ url: deed.photoUrls[0] }] }),
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
      _count: { select: { comments: true, participants: true } },
      reactions: true,
      comments: {
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      participants: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  if (!deed) notFound();

  const isCTA = deed.type === "CALL_TO_ACTION";
  const isPast = isCTA && deed.eventDate ? deed.eventDate < new Date() : false;

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

  const isJoined = session?.user?.id
    ? deed.participants.some((p) => p.userId === session.user!.id)
    : false;

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
      <article className={`card p-6 ${isCTA ? "border-l-4 border-l-sky-500" : ""}`}>
        <div className="flex items-start gap-3.5">
          <Link href={`/profile/${deed.author.id}`} className="shrink-0">
            <Avatar name={deed.author.name} image={deed.author.image} />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
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
              {isCTA && (
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/20">
                  Call to Action
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-[var(--text-primary)] mt-3 leading-snug">{deed.title}</h1>
            <p className="text-[var(--text-secondary)] mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{deed.description}</p>

            {/* CTA event details */}
            {isCTA && (
              <div className="mt-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/15 space-y-3">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Event Details
                </h3>

                {deed.eventDate && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      {formatEventDate(deed.eventDate)}
                      {deed.eventEndDate && ` — ${formatEventDate(deed.eventEndDate)}`}
                    </span>
                    {isPast && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border border-[var(--border)]">
                        Passed
                      </span>
                    )}
                  </div>
                )}

                {deed.meetingPoint && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{deed.meetingPoint}</span>
                  </div>
                )}

                {deed.whatToBring && (
                  <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <svg className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span><strong className="text-[var(--text-primary)]">Bring:</strong> {deed.whatToBring}</span>
                  </div>
                )}

                <div className="pt-2">
                  <JoinButton
                    deedId={deed.id}
                    initialIsJoined={isJoined}
                    initialCount={deed._count.participants}
                    maxSpots={deed.maxSpots}
                    isAuthor={deed.author.id === session?.user?.id}
                    isPast={isPast}
                    sessionUserId={session?.user?.id}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              <CategoryBadge category={deed.category as DeedCategory} />
              {!isCTA && deed.location && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {deed.location}
                </span>
              )}
            </div>

            {deed.photoUrls.length > 0 && (
              <div className={`mt-4 gap-2 ${deed.photoUrls.length === 1 ? "" : "grid grid-cols-2"}`}>
                {deed.photoUrls.map((url, i) => (
                  <div key={i} className={`rounded-xl overflow-hidden relative ${deed.photoUrls.length === 1 ? "" : i === 0 && deed.photoUrls.length === 3 ? "col-span-2" : ""}`}>
                    <img
                      src={url}
                      alt={`${deed.title} photo ${i + 1}`}
                      className={`w-full object-cover ${deed.photoUrls.length === 1 ? "max-h-96" : "h-48"}`}
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                  </div>
                ))}
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

      {/* Participants list for CTAs */}
      {isCTA && deed.participants.length > 0 && (
        <div className="card p-6">
          <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">
            Participants ({deed._count.participants})
          </h2>
          <div className="space-y-3">
            {deed.participants.map((p) => (
              <div key={p.id} className="flex items-start gap-3">
                <Link href={`/profile/${p.user.id}`} className="shrink-0">
                  <Avatar name={p.user.name} image={p.user.image} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${p.user.id}`}
                      className="text-[13px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                    >
                      {p.user.name}
                    </Link>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                  {p.message && (
                    <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                      &ldquo;{p.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
