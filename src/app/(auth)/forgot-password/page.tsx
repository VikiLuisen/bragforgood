"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Logo size="lg" href="/" />
          <h1 className="text-xl font-bold text-[var(--text-primary)] mt-6">Forgot your password?</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">No worries. Even the best do-gooders forget things.</p>
        </div>

        <div className="card p-6">
          {success ? (
            <div className="text-center space-y-3">
              <div className="bg-[var(--accent)]/10 text-[var(--accent)] text-sm p-3 rounded-xl font-medium">
                If that email is registered, we sent you a reset link. Check your inbox!
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">
                Didn&apos;t get it? Check your spam folder or try again.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-xl text-center font-medium">
                  {error}
                </div>
              )}

              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}
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
