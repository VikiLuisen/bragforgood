"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: "Please select an image file" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Image must be less than 5MB" }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoUrl("");
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadPhoto(): Promise<string | undefined> {
    if (!photoFile) return photoUrl || undefined;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", photoFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      let message = "Failed to upload image";
      try {
        const data = await res.json();
        message = data.error || message;
      } catch {
        if (res.status === 413) message = "Image is too large. Try a smaller file.";
      }
      throw new Error(message);
    }

    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Upload photo first if there's a file
    let finalPhotoUrl: string | undefined;
    try {
      finalPhotoUrl = await uploadPhoto();
    } catch (err) {
      setErrors({ photo: err instanceof Error ? err.message : "Failed to upload image" });
      return;
    }

    const parsed = createDeedSchema.safeParse({
      title,
      description,
      category,
      photoUrl: finalPhotoUrl || undefined,
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

          {/* Photo upload */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Photo (optional)
            </label>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-card)] px-4 py-8 text-center transition-colors group"
              >
                <svg className="w-8 h-8 mx-auto text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                <p className="text-sm text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] mt-2 font-medium transition-colors">
                  Tap to add a photo
                </p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                  JPEG, PNG, WebP, or GIF up to 5MB
                </p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            {errors.photo && <p className="text-xs text-red-400 font-medium">{errors.photo}</p>}
          </div>

          <Input
            id="location"
            label="Location (optional)"
            placeholder="e.g., Central Park, New York"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={errors.location}
          />

          <Button type="submit" className="w-full" size="lg" loading={loading || uploading}>
            {uploading ? "Uploading photo..." : "Post Your Brag"}
          </Button>
        </form>
      </div>
    </div>
  );
}
