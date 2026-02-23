"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { DEED_CATEGORIES } from "@/lib/constants";
import type { DeedCategory } from "@/lib/constants";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  postCount: number;
  karmaScore: number;
}

interface AdminPost {
  id: string;
  title: string;
  category: string;
  flagCount: number;
  isExample: boolean;
  createdAt: string;
  author: { id: string; name: string };
  commentCount: number;
  reactionCount: number;
}

interface AdminData {
  users: AdminUser[];
  posts: AdminPost[];
  stats: { totalUsers: number; totalPosts: number; totalReactions: number };
}

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "posts">("users");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDeleteUser(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok && data) {
      setData({
        ...data,
        users: data.users.filter((u) => u.id !== id),
        posts: data.posts.filter((p) => p.author.id !== id),
        stats: {
          ...data.stats,
          totalUsers: data.stats.totalUsers - 1,
          totalPosts: data.stats.totalPosts - data.posts.filter((p) => p.author.id === id).length,
        },
      });
    }
    setDeletingId(null);
    setConfirmId(null);
  }

  async function handleDeletePost(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok && data) {
      setData({
        ...data,
        posts: data.posts.filter((p) => p.id !== id),
        stats: { ...data.stats, totalPosts: data.stats.totalPosts - 1 },
      });
    }
    setDeletingId(null);
    setConfirmId(null);
  }

  if (loading) {
    return (
      <div className="animate-fade-in flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[var(--text-secondary)]">Failed to load admin data.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Manage users and posts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">{data.stats.totalUsers}</div>
          <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-bold mt-1">Users</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">{data.stats.totalPosts}</div>
          <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-bold mt-1">Posts</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">{data.stats.totalReactions}</div>
          <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-bold mt-1">Reactions</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-elevated)] rounded-xl p-1">
        <button
          onClick={() => setTab("users")}
          className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all ${
            tab === "users"
              ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          }`}
        >
          Users ({data.users.length})
        </button>
        <button
          onClick={() => setTab("posts")}
          className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-all ${
            tab === "posts"
              ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          }`}
        >
          Posts ({data.posts.length})
        </button>
      </div>

      {/* Content */}
      {tab === "users" ? (
        <div className="space-y-2">
          {data.users.map((user) => (
            <div key={user.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[var(--text-tertiary)]">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</span>
                  <span className="text-[10px] text-[var(--accent)] font-medium">{user.karmaScore} karma</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] text-[var(--text-tertiary)] truncate">{user.email}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">{user.postCount} posts</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div className="shrink-0">
                {confirmId === user.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingId === user.id}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      {deletingId === user.id ? "..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(user.id)}
                    className="text-[11px] text-red-400/70 hover:text-red-400 font-medium transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {data.posts.map((post) => {
            const catConfig = DEED_CATEGORIES[post.category as DeedCategory];

            return (
              <div key={post.id} className="card p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/deeds/${post.id}`)}
                        className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate text-left"
                      >
                        {post.title}
                      </button>
                      {post.isExample && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] border border-[rgba(52,211,153,0.15)] shrink-0">
                          Example
                        </span>
                      )}
                      {post.flagCount > 0 && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 shrink-0">
                          {post.flagCount} {post.flagCount === 1 ? "report" : "reports"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-[var(--text-tertiary)]">by {post.author.name}</span>
                      {catConfig && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catConfig.color}`}>
                          {catConfig.label}
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--text-tertiary)]">{post.reactionCount} reactions</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">{post.commentCount} comments</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {confirmId === post.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletingId === post.id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                          {deletingId === post.id ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(post.id)}
                        className="text-[11px] text-red-400/70 hover:text-red-400 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
