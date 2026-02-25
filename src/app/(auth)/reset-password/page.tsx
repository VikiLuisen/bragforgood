"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { useTranslation } from "@/lib/useTranslation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-3">
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl font-medium">
          {t("auth.invalidResetLink")}
        </div>
        <Link href="/forgot-password" className="text-[var(--accent)] hover:brightness-110 font-semibold text-sm transition-all">
          {t("auth.requestNewLink")}
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = resetPasswordSchema.safeParse({ token, password, confirmPassword });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error || t("auth.somethingWentWrong") });
      } else {
        router.push("/sign-in?reset=success");
      }
    } catch {
      setErrors({ form: t("auth.somethingWentWrong") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center font-medium">
          {errors.form}
        </div>
      )}

      <Input
        id="password"
        label={t("auth.newPassword")}
        type="password"
        placeholder={t("auth.atLeast8")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />

      <Input
        id="confirmPassword"
        label={t("auth.confirmNewPassword")}
        type="password"
        placeholder={t("auth.reenterNewPassword")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" className="w-full" loading={loading}>
        {t("auth.resetPassword")}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Logo size="lg" href="/" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-6">{t("auth.setNewPassword")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{t("auth.makeItStrong")}</p>
        </div>

        <div className="card p-6">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          {t("auth.rememberPassword")}{" "}
          <Link href="/sign-in" className="text-[var(--accent)] hover:brightness-110 font-semibold transition-all">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
