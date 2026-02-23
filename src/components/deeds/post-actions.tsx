"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostActionsProps {
  deedId: string;
  authorId: string;
  sessionUserId?: string;
}

export function PostActions({ deedId, authorId, sessionUserId }: PostActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!sessionUserId || sessionUserId !== authorId) return null;

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/deeds/${deedId}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/feed");
      router.refresh();
    } else {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); setConfirmDelete(false); }}
        className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1"
        title="Post options"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-full mb-1 z-50 w-40 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] shadow-xl py-1">
            {!confirmDelete ? (
              <>
                <button
                  onClick={() => { setOpen(false); router.push(`/deeds/${deedId}/edit`); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] font-medium transition-colors"
                >
                  Edit post
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-[var(--bg-card-hover)] font-medium transition-colors"
                >
                  Delete post
                </button>
              </>
            ) : (
              <div className="px-4 py-3">
                <p className="text-xs text-red-400 font-medium mb-2">Delete this post?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {deleting ? "..." : "Yes"}
                  </button>
                  <button
                    onClick={() => { setConfirmDelete(false); setOpen(false); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
