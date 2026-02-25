"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useTranslation } from "@/lib/useTranslation";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const resetSuccess = searchParams.get("reset") === "success";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("auth.invalidCredentials"));
    } else {
      router.push("/feed");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Logo size="lg" href="/" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-6">{t("auth.backToBrag")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{t("auth.worldNeeds")}</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {resetSuccess && (
              <div className="bg-[var(--accent)]/10 text-[var(--accent)] text-sm p-3 rounded-xl text-center font-medium">
                {t("auth.passwordUpdated")}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            <Input
              id="email"
              label={t("auth.email")}
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label={t("auth.password")}
              type="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {t("auth.signIn")}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          {t("auth.noAccount")}{" "}
          <Link href="/sign-up" className="text-[var(--accent)] hover:brightness-110 font-semibold transition-all">
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
