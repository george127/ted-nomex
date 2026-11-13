"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { login, getGoogleAuthUrl } from "@/modules/auth/session";
import { PasswordInput } from "@/components/auth/PasswordInput";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const registered = searchParams.get("registered") === "1";
  const prefillEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      const fallback = user.role === "ADMIN" ? "/admin" : "/dashboard";
      router.push(next ?? fallback);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>{registered ? "Account created" : "Welcome back"}</h1>
      <p className="muted">
        {registered
          ? "Sign in with your new credentials to continue."
          : "Sign in to your Ted-Nomex account."}
      </p>

      {registered && (
        <p className="form-success" role="status">
          Your account is ready. Please sign in below.
        </p>
      )}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <PasswordInput
        id="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        required
      />

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <a href={getGoogleAuthUrl()} className="auth-google">
        <span className="material-symbols-outlined">g_translate</span>
        Continue with Google
      </a>

      <p className="form-footer">
        <Link href="/forgot-password">Forgot password?</Link>
      </p>
      <p className="form-footer">
        Don&apos;t have an account? <Link href="/register">Create one</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-form">
          <p className="muted">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}