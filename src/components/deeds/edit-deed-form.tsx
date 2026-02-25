"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEED_CATEGORIES } from "@/lib/constants";
import { createDeedSchema } from "@/lib/validations/deed";
import { useTranslation } from "@/lib/useTranslation";

const categoryOptions = Object.entries(DEED_CATEGORIES).map(([value, { label }]) => ({
  value,
  label,
}));

interface EditDeedFormProps {
  deed: {
    id: string;
    title: string;
    description: string;
    category: string;
    photoUrls: string[];
    location: string | null;
  };
}

export function EditDeedForm({ deed }: EditDeedFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(deed.title);
  const [description, setDescription] = useState(deed.description);
  const [category, setCategory] = useState(deed.category);
  const [photoUrls, setPhotoUrls] = useState<string[]>(deed.photoUrls);
  const [pendingFiles, setPendingFiles] = useState<{ file: File; preview: string }[]>([]);
  const [location, setLocation] = useState(deed.location || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const totalPhotos = photoUrls.length + pendingFiles.length;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 5 - totalPhotos;
    const toAdd = files.slice(0, remaining);

    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, photo: t("deed.imageOnly") }));
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: t("deed.imageTooLarge") }));
        return;
      }
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });

    const newPending = toAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExistingPhoto(index: number) {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function removePendingPhoto(index: number) {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function uploadPendingPhotos(): Promise<string[]> {
    if (pendingFiles.length === 0) return [];

    setUploading(true);
    const urls: string[] = [];

    for (const { file } of pendingFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });

      if (!res.ok) {
        setUploading(false);
        let message = t("deed.uploadFailed");
        try { const data = await res.json(); message = data.error || message; } catch {}
        throw new Error(message);
      }

      const data = await res.json();
      urls.push(data.url);
    }

    setUploading(false);
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    let uploadedUrls: string[] = [];
    try {
      uploadedUrls = await uploadPendingPhotos();
    } catch (err) {
      setErrors({ photo: err instanceof Error ? err.message : t("deed.uploadFailed") });
      return;
    }

    const allPhotoUrls = [...photoUrls, ...uploadedUrls];

    const parsed = createDeedSchema.safeParse({
      title,
      description,
      category,
      photoUrls: allPhotoUrls,
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

    const res = await fetch(`/api/deeds/${deed.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setErrors({ form: data.error || t("common.somethingWentWrong") });
      return;
    }

    router.push(`/deeds/${deed.id}`);
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{t("deed.editTitle")}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{t("deed.editSubtitle")}</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center font-medium">
              {errors.form}
            </div>
          )}

          <Input
            id="title"
            label={t("deed.titleBrag")}
            placeholder={t("deed.titlePlaceholderBrag")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          <Textarea
            id="description"
            label={t("deed.descriptionBrag")}
            placeholder={t("deed.descPlaceholderBrag")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            required
          />

          <div className="space-y-1.5">
            <label htmlFor="category" className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              {t("deed.category")}
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
              required
            >
              <option value="">{t("deed.selectCategory")}</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-400 font-medium">{errors.category}</p>}
          </div>

          {/* Photos */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              {t("deed.photos")}
            </label>

            {(photoUrls.length > 0 || pendingFiles.length > 0) && (
              <div className="grid grid-cols-3 gap-2">
                {photoUrls.map((url, i) => (
                  <div key={`existing-${i}`} className="relative rounded-xl overflow-hidden aspect-square">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {pendingFiles.map((pf, i) => (
                  <div key={`pending-${i}`} className="relative rounded-xl overflow-hidden aspect-square">
                    <img src={pf.preview} alt={`New photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePendingPhoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalPhotos < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-card)] px-4 py-6 text-center transition-colors group"
              >
                <svg className="w-6 h-6 mx-auto text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <p className="text-sm text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] mt-1.5 font-medium transition-colors">
                  {totalPhotos === 0 ? t("deed.tapToAdd") : t("deed.addMore")}
                </p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                  {5 - totalPhotos} {t("deed.remaining")}
                </p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {errors.photo && <p className="text-xs text-red-400 font-medium">{errors.photo}</p>}
          </div>

          <Input
            id="location"
            label={t("deed.location")}
            placeholder={t("deed.locationPlaceholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={errors.location}
          />

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" size="lg" loading={loading || uploading}>
              {uploading ? t("deed.uploadingPhotos") : t("deed.saveChanges")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => router.back()}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
