"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, getGoogleAuthUrl } from "@/modules/auth/session";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>Welcome back</h1>
      <p className="muted">Sign in to your Ted-Nomex account.</p>

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