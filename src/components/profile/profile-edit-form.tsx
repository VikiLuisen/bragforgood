"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";

interface ProfileEditFormProps {
  user: {
    name: string;
    bio: string | null;
    image: string | null;
  };
  onCancel: () => void;
}

export function ProfileEditForm({ user, onCancel }: ProfileEditFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [imageUrl, setImageUrl] = useState<string | null>(user.image);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be less than 5MB" }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadPhoto(): Promise<string | null> {
    if (!photoFile) return imageUrl;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", photoFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to upload image");
    }

    const data = await res.json();
    return data.url;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    let finalImageUrl: string | null;
    try {
      finalImageUrl = await uploadPhoto();
    } catch (err) {
      setErrors({ image: err instanceof Error ? err.message : "Failed to upload image" });
      return;
    }

    setSaving(true);

    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        bio: bio || "",
        image: finalImageUrl,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
      } else {
        setErrors({ form: data.error || "Something went wrong" });
      }
      return;
    }

    // Refresh the session so navbar avatar/name updates
    await updateSession();
    onCancel();
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);

    const res = await fetch("/api/users/me", { method: "DELETE" });

    if (!res.ok) {
      setDeleting(false);
      setErrors({ form: "Failed to delete account" });
      return;
    }

    signOut({ callbackUrl: "/" });
  }

  const displayImage = photoPreview || imageUrl;

  return (
    <div className="card p-6 animate-fade-in">
      <form onSubmit={handleSave} className="space-y-5">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Edit Profile</h2>

        {errors.form && (
          <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center font-medium">
            {errors.form}
          </div>
        )}

        {/* Profile photo */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {displayImage ? (
              <img
                src={displayImage}
                alt={name}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-[var(--bg-card)]"
              />
            ) : (
              <Avatar name={name} size="lg" className="!h-20 !w-20 !text-2xl" />
            )}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-[var(--accent)] hover:brightness-110 transition-all"
              >
                {displayImage ? "Change photo" : "Upload photo"}
              </button>
              {displayImage && (
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          {errors.image && <p className="text-xs text-red-400 font-medium">{errors.image}</p>}
        </div>

        <Input
          id="name"
          label="Name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <Textarea
          id="bio"
          label="Bio"
          placeholder="Tell people about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          error={errors.bio}
        />
        <p className="text-[10px] text-[var(--text-tertiary)] -mt-3">{bio.length}/200</p>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" loading={saving || uploading}>
            {uploading ? "Uploading..." : "Save Changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Delete account */}
      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-400 font-medium">
              Are you sure? This will permanently delete your account and all your brags, comments, and reactions. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
