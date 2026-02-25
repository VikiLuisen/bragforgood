"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEED_CATEGORIES } from "@/lib/constants";
import { createDeedSchema } from "@/lib/validations/deed";
import type { DeedType } from "@/lib/constants";

const categoryOptions = Object.entries(DEED_CATEGORIES).map(([value, { label }]) => ({
  value,
  label,
}));

export function DeedForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialType = searchParams.get("type") === "CALL_TO_ACTION" ? "CALL_TO_ACTION" : "BRAG";
  const [deedType, setDeedType] = useState<DeedType>(initialType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pendingFiles, setPendingFiles] = useState<{ file: File; preview: string }[]>([]);
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [whatToBring, setWhatToBring] = useState("");
  const [maxSpots, setMaxSpots] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isCTA = deedType === "CALL_TO_ACTION";

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 5 - pendingFiles.length;
    const toAdd = files.slice(0, remaining);

    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, photo: "Please select image files only" }));
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: "Each image must be less than 4MB" }));
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

  function removePendingPhoto(index: number) {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function uploadPhotos(): Promise<string[]> {
    if (pendingFiles.length === 0) return [];

    setUploading(true);
    const urls: string[] = [];

    for (const { file } of pendingFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });

      if (!res.ok) {
        setUploading(false);
        let message = "Failed to upload image";
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

    let photoUrls: string[] = [];
    try {
      photoUrls = await uploadPhotos();
    } catch (err) {
      setErrors({ photo: err instanceof Error ? err.message : "Failed to upload image" });
      return;
    }

    const parsed = createDeedSchema.safeParse({
      title,
      description,
      category,
      photoUrls,
      location: location || undefined,
      type: deedType,
      ...(isCTA ? {
        eventDate: eventDate || undefined,
        eventEndDate: eventEndDate || undefined,
        meetingPoint: meetingPoint || undefined,
        whatToBring: whatToBring || undefined,
        maxSpots: maxSpots ? Number(maxSpots) : undefined,
      } : {}),
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

  // Get the minimum datetime for the event date input (now)
  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {isCTA ? "Rally the troops" : "Brag about it"}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          {isCTA ? "Organize something good. Get people involved." : "Go on, tell everyone how awesome you are."}
        </p>
      </div>

      <div className="card p-6">
        {/* Type toggle */}
        <div className="flex rounded-xl bg-[var(--bg-elevated)] p-1 mb-6">
          <button
            type="button"
            onClick={() => setDeedType("BRAG")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              !isCTA
                ? "bg-[var(--accent)] text-[#0a0a0b] shadow-sm"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Brag
          </button>
          <button
            type="button"
            onClick={() => setDeedType("CALL_TO_ACTION")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isCTA
                ? "bg-sky-500 text-white shadow-sm"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Call to Action
          </button>
        </div>

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
            label={isCTA ? "What are you organizing?" : "What are you bragging about?"}
            placeholder={isCTA ? "e.g., Beach cleanup at Seefeld" : "e.g., Cleaned up the park near Main St."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          <Textarea
            id="description"
            label={isCTA ? "Tell people what this is about" : "Give us the details"}
            placeholder={isCTA ? "Describe the event — what will you do, why it matters..." : "Don't be modest — spill it all..."}
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

          {/* CTA-specific fields */}
          {isCTA && (
            <div className="space-y-5 p-4 rounded-xl bg-sky-500/5 border border-sky-500/15">
              <div className="flex items-center gap-2 text-sky-400 text-[11px] font-semibold uppercase tracking-wider">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="eventDate" className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Start date & time *
                  </label>
                  <input
                    id="eventDate"
                    type="datetime-local"
                    min={minDateTime}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                    required
                  />
                  {errors.eventDate && <p className="text-xs text-red-400 font-medium">{errors.eventDate}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="eventEndDate" className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    End date & time
                  </label>
                  <input
                    id="eventEndDate"
                    type="datetime-local"
                    min={eventDate || minDateTime}
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all"
                  />
                  {errors.eventEndDate && <p className="text-xs text-red-400 font-medium">{errors.eventEndDate}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="meetingPoint" className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Meeting point *
                </label>
                <input
                  id="meetingPoint"
                  type="text"
                  placeholder="e.g., Main entrance of Central Park"
                  maxLength={200}
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all placeholder:text-[var(--text-tertiary)]"
                  required
                />
                {errors.meetingPoint && <p className="text-xs text-red-400 font-medium">{errors.meetingPoint}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatToBring" className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  What to bring (optional)
                </label>
                <textarea
                  id="whatToBring"
                  placeholder="e.g., Trash bags, gloves, water bottle"
                  maxLength={500}
                  rows={2}
                  value={whatToBring}
                  onChange={(e) => setWhatToBring(e.target.value)}
                  className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all resize-none placeholder:text-[var(--text-tertiary)]"
                />
                {errors.whatToBring && <p className="text-xs text-red-400 font-medium">{errors.whatToBring}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="maxSpots" className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Max participants (optional)
                </label>
                <input
                  id="maxSpots"
                  type="number"
                  min={1}
                  max={500}
                  placeholder="Leave empty for unlimited"
                  value={maxSpots}
                  onChange={(e) => setMaxSpots(e.target.value)}
                  className="block w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm focus:border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all placeholder:text-[var(--text-tertiary)]"
                />
                {errors.maxSpots && <p className="text-xs text-red-400 font-medium">{errors.maxSpots}</p>}
              </div>
            </div>
          )}

          {/* Photo upload */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Photos (up to 5)
            </label>

            {pendingFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {pendingFiles.map((pf, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                    <img src={pf.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
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

            {pendingFiles.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-card)] px-4 py-6 text-center transition-colors group"
              >
                <svg className="w-6 h-6 mx-auto text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                <p className="text-sm text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] mt-1.5 font-medium transition-colors">
                  {pendingFiles.length === 0 ? "Tap to add photos" : "Add more photos"}
                </p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                  JPEG, PNG, WebP, or GIF up to 4MB each ({5 - pendingFiles.length} remaining)
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

          {!isCTA && (
            <Input
              id="location"
              label="Location (optional)"
              placeholder="e.g., Central Park, New York"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
            />
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading || uploading}>
            {uploading ? "Uploading photos..." : isCTA ? "Rally the Troops" : "Post Your Brag"}
          </Button>
        </form>
      </div>
    </div>
  );
}
