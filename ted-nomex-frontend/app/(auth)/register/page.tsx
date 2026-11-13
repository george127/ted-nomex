"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register, getGoogleAuthUrl } from "@/modules/auth/session";
import { PasswordInput } from "@/components/auth/PasswordInput";

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(pw)) return "Password must contain a letter";
  if (!/\d/.test(pw)) return "Password must contain a number";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const pwErr = validatePassword(password);
    if (pwErr) {
      setError(pwErr);
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // Do NOT auto-login. Send them to sign in.
      router.push(`/login?registered=1&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>Create account</h1>
      <p className="muted">
        Join Ted-Nomex to manage orders, quotes and projects.
      </p>

      <label htmlFor="name">Full name</label>
      <input
        id="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={80}
      />

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
        autoComplete="new-password"
        required
        minLength={8}
      />
      <p className="form-hint-inline">
        At least 8 characters, must include a letter and a number.
      </p>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <a href={getGoogleAuthUrl()} className="auth-google">
        <span className="material-symbols-outlined">g_translate</span>
        Continue with Google
      </a>

      <p className="form-footer">
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </form>
  );
}