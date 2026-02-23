"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEED_CATEGORIES } from "@/lib/constants";
import { createDeedSchema } from "@/lib/validations/deed";

const categoryOptions = Object.entries(DEED_CATEGORIES).map(([value, { label }]) => ({
  value,
  label,
}));

export function DeedForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = createDeedSchema.safeParse({
      title,
      description,
      category,
      photoUrl: photoUrl || undefined,
      location: location || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/deeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      if (data.moderation) {
        setErrors({ moderation: data.error });
      } else {
        setErrors({ form: data.error || "Something went wrong" });
      }
      return;
    }

    const deed = await res.json();
    router.push(`/deeds/${deed.id}`);
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Brag about it</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Go on, tell everyone how awesome you are.</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.moderation && (
            <div className="bg-amber-500/10 text-amber-400 text-sm p-4 rounded-xl font-medium border border-amber-500/20">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{errors.moderation}</span>
              </div>
            </div>
          )}
          {errors.form && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center font-medium">
              {errors.form}
            </div>
          )}

          <Input
            id="title"
            label="What are you bragging about?"
            placeholder="e.g., Cleaned up the park near Main St."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          <Textarea
            id="description"
            label="Give us the details"
            placeholder="Don't be modest — spill it all..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            required
          />

          <div className="space-y-1.5">
            <label htmlFor="category" className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
              required
            >
              <option value="">Select a category</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-400 font-medium">{errors.category}</p>}
          </div>

          <Input
            id="photoUrl"
            label="Photo URL (optional)"
            placeholder="https://example.com/photo.jpg"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            error={errors.photoUrl}
          />

          <Input
            id="location"
            label="Location (optional)"
            placeholder="e.g., Central Park, New York"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={errors.location}
          />

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Post Your Brag
          </Button>
        </form>
      </div>
    </div>
  );
}
