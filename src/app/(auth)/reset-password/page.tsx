"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { resetPasswordSchema } from "@/lib/validations/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-3">
        <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl font-medium">
          Invalid reset link. Please request a new one.
        </div>
        <Link href="/forgot-password" className="text-[var(--accent)] hover:brightness-110 font-semibold text-sm transition-all">
          Request new reset link
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
        setErrors({ form: data.error || "Something went wrong" });
      } else {
        router.push("/sign-in?reset=success");
      }
    } catch {
      setErrors({ form: "Something went wrong" });
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
        label="New Password"
        type="password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />

      <Input
        id="confirmPassword"
        label="Confirm New Password"
        type="password"
        placeholder="Re-enter your new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" className="w-full" loading={loading}>
        Reset Password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Logo size="lg" href="/" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-6">Set a new password</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Make it strong. Your good deeds deserve protection.</p>
        </div>

        <div className="card p-6">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-[var(--accent)] hover:brightness-110 font-semibold transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
