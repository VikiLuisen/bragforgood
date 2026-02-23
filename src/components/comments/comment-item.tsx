import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { CommentWithUser } from "@/types";

interface CommentItemProps {
  comment: CommentWithUser;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-3">
      <Link href={`/profile/${comment.user.id}`} className="shrink-0">
        <Avatar name={comment.user.name} image={comment.user.image} size="sm" />
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${comment.user.id}`}
            className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
          >
            {comment.user.name}
          </Link>
          <span className="text-[10px] text-[var(--text-tertiary)] font-medium">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5 leading-relaxed">{comment.body}</p>
      </div>
    </div>
  );
}
