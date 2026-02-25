"use client";

import { useState, useEffect } from "react";
import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/useTranslation";
import type { CommentWithUser } from "@/types";

interface InlineCommentSectionProps {
  deedId: string;
  commentCount: number;
  sessionUserId?: string;
  onCommentCountChange?: (count: number) => void;
}

export function InlineCommentSection({ deedId, commentCount, sessionUserId, onCommentCountChange }: InlineCommentSectionProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(commentCount);
  const hasMore = comments.length < totalCount;

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch(`/api/deeds/${deedId}/comments`);
      const data = await res.json();
      setComments(data.items);
      setCursor(data.nextCursor);
      setLoading(false);
    }
    fetchComments();
  }, [deedId]);

  async function loadMore() {
    if (!cursor) return;
    const res = await fetch(`/api/deeds/${deedId}/comments?cursor=${cursor}`);
    const data = await res.json();
    setComments((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
  }

  function handleCommentPosted(comment: CommentWithUser) {
    setComments((prev) => [comment, ...prev]);
    const newCount = totalCount + 1;
    setTotalCount(newCount);
    onCommentCountChange?.(newCount);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-[var(--border)]">
      {sessionUserId && (
        <CommentForm deedId={deedId} onCommentPosted={handleCommentPosted} />
      )}

      {comments.length === 0 ? (
        <p className="text-xs text-[var(--text-tertiary)] py-2">
          {t("commentSection.noComments")}
        </p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {hasMore && (
        <Button variant="ghost" size="sm" onClick={loadMore} className="w-full mt-1">
          {t("commentSection.loadMore")}
        </Button>
      )}
    </div>
  );
}
