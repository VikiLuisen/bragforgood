"use client";

import { useState } from "react";
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";
import type { CommentWithUser } from "@/types";

interface CommentListProps {
  deedId: string;
  initialComments: CommentWithUser[];
  totalCount: number;
}

export function CommentList({ deedId, initialComments, totalCount }: CommentListProps) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(
    initialComments.length > 0 ? initialComments[initialComments.length - 1].id : null
  );
  const hasMore = comments.length < totalCount;

  async function loadMore() {
    if (loading || !cursor) return;
    setLoading(true);

    const res = await fetch(`/api/deeds/${deedId}/comments?cursor=${cursor}`);
    const data = await res.json();

    setComments((prev) => [...prev, ...data.items]);
    setCursor(data.nextCursor);
    setLoading(false);
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm text-[var(--text-tertiary)] py-4">
        No comments yet. Be the first to leave a kind word!
      </p>
    );
  }

  return (
    <div>
      <div className="divide-y divide-[var(--border)]">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      {hasMore && (
        <Button variant="ghost" size="sm" onClick={loadMore} loading={loading} className="w-full mt-2">
          Load more comments
        </Button>
      )}
    </div>
  );
}
