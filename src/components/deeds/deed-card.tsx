"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge } from "./category-badge";
import { ReportButton } from "./report-button";
import { PostActions } from "./post-actions";
import { ShareButton } from "./share-button";
import { ReactionBar } from "@/components/reactions/reaction-bar";
import { TranslateButton } from "@/components/ui/translate-button";
import { InlineCommentSection } from "@/components/comments/inline-comment-section";
import { formatDate } from "@/lib/utils";
import type { DeedWithAuthor } from "@/types";

interface DeedCardProps {
  deed: DeedWithAuthor;
  sessionUserId?: string;
}

export function DeedCard({ deed, sessionUserId }: DeedCardProps) {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(deed._count.comments);

  // Combine title and description for translation
  const originalText = `${deed.title}\n---\n${deed.description}`;

  function handleTranslated(translated: string | null) {
    setTranslatedText(translated);
  }

  // Parse translated text back into title and description
  const displayTitle = translatedText
    ? translatedText.split("\n---\n")[0] || translatedText.split("\n")[0]
    : deed.title;
  const displayDescription = translatedText
    ? (translatedText.split("\n---\n")[1] || translatedText.split("\n").slice(1).join("\n"))
    : deed.description;

  return (
    <article className="feed-item card p-5">
      <div className="flex items-start gap-3.5">
        <Link href={`/profile/${deed.author.id}`} className="shrink-0">
          <Avatar name={deed.author.name} image={deed.author.image} size="md" karmaScore={deed.author.karmaScore} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${deed.author.id}`}
              className="text-[13px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
            >
              {deed.author.name}
            </Link>
            {typeof deed.author.karmaScore === "number" && deed.author.karmaScore > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--accent)]" title="Karma points">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                {deed.author.karmaScore}
              </span>
            )}
            <span className="text-[11px] text-[var(--text-tertiary)]">{formatDate(deed.createdAt)}</span>
            {deed.isExample && (
              <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(52,211,153,0.15)]">
                Example
              </span>
            )}
          </div>

          <Link href={`/deeds/${deed.id}`} className="block mt-1.5 group">
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
              {displayTitle}
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
              {displayDescription}
            </p>
          </Link>

          {translatedText && (
            <span className="text-[10px] text-[var(--accent)] font-medium mt-0.5 inline-block opacity-70">
              Translated
            </span>
          )}

          {deed.photoUrl && (
            <div className="mt-3 rounded-xl overflow-hidden relative">
              <img
                src={deed.photoUrl}
                alt={deed.title}
                className="w-full max-h-64 object-cover"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <CategoryBadge category={deed.category} />
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

          <div className="mt-3.5 pt-3 border-t border-[var(--border)]">
            <ReactionBar
              deedId={deed.id}
              initialCounts={deed.reactionCounts}
              initialUserReactions={deed.userReactions}
              compact
              sessionUserId={sessionUserId}
            />
            <div className="flex items-center gap-3 mt-2.5">
              <ShareButton deedId={deed.id} title={deed.title} />
              {sessionUserId && (
                <TranslateButton
                  text={originalText}
                  onTranslated={handleTranslated}
                  compact
                />
              )}
              {sessionUserId ? (
                <button
                  onClick={() => setShowComments(!showComments)}
                  className={`text-[11px] transition-colors font-medium ${
                    showComments
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-tertiary)] hover:text-[var(--accent)]"
                  }`}
                >
                  {commentCount} {commentCount === 1 ? "comment" : "comments"}
                </button>
              ) : (
                <span className="text-[11px] text-[var(--text-tertiary)] font-medium">
                  {commentCount} {commentCount === 1 ? "comment" : "comments"}
                </span>
              )}
              {sessionUserId && (
                <div className="ml-auto flex items-center gap-3">
                  <ReportButton deedId={deed.id} />
                  <PostActions deedId={deed.id} authorId={deed.author.id} sessionUserId={sessionUserId} />
                </div>
              )}
            </div>
          </div>

          {showComments && sessionUserId && (
            <InlineCommentSection
              deedId={deed.id}
              commentCount={commentCount}
              sessionUserId={sessionUserId}
              onCommentCountChange={setCommentCount}
            />
          )}
        </div>
      </div>
    </article>
  );
}
