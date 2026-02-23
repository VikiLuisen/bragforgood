"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CommentFormProps {
  deedId: string;
  onCommentPosted?: (comment: { id: string; body: string; createdAt: string; user: { id: string; name: string; image: string | null } }) => void;
}

export function CommentForm({ deedId, onCommentPosted }: CommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modError, setModError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    setError("");
    setModError("");

    const res = await fetch(`/api/deeds/${deedId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      if (data.moderation) {
        setModError(data.error);
      } else {
        setError(data.error || "Failed to post comment");
      }
      return;
    }

    const data = await res.json();
    setBody("");

    if (onCommentPosted) {
      onCommentPosted(data);
    } else {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      {modError && (
        <div className="text-xs text-amber-400 font-medium mb-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          {modError}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-400 font-medium mb-2">{error}</p>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a kind word..."
          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text-primary)] shadow-sm placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
          maxLength={500}
        />
        <Button type="submit" size="sm" loading={loading} disabled={!body.trim()}>
          Post
        </Button>
      </div>
    </form>
  );
}
