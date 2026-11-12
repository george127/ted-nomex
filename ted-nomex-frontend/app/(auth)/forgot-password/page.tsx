"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { requestPasswordReset, resetPassword } from "@/modules/auth/session";
import { PasswordInput } from "@/components/auth/PasswordInput";

// ── Step 1: request email ─────────────────────────────────
function RequestForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await requestPasswordReset(email);
      setSent(true);
      if (result.devToken) setDevToken(result.devToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>Forgot password</h1>
      <p className="muted">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {!sent && (
        <>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sending\u2026" : "Send reset link"}
          </button>
        </>
      )}

      {sent && (
        <>
          <p className="form-success">
            If an account exists for <strong>{email}</strong>, a reset link will
            arrive shortly.
          </p>

          {devToken && (
            <div className="form-hint">
              <strong>Dev mode:</strong> Resend isn&apos;t delivering emails yet.
              Click to test the reset form now:
              <br />
              <Link
                href={`/forgot-password?token=${encodeURIComponent(devToken)}`}
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  color: "var(--color-primary)",
                  fontWeight: 700,
                }}
              >
                → Continue to password reset
              </Link>
            </div>
          )}
        </>
      )}

      <p className="form-footer">
        <Link href="/login">Back to sign in</Link>
      </p>
    </form>
  );
}

// ── Step 2: enter new password (same page, ?token= in URL) ─
function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Za-z]/.test(password)) {
      setError("Password must contain a letter");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must contain a number");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-form">
        <h1>Password updated</h1>
        <p className="form-success">
          Your password has been changed. Redirecting to sign in…
        </p>
        <p className="form-footer">
          <Link href="/login">Sign in now</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>Choose a new password</h1>
      <p className="muted">
        Your reset link is valid. Enter a strong new password below.
      </p>

      <label htmlFor="password">New password</label>
      <PasswordInput
        id="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        required
        minLength={8}
        disabled={loading}
      />
      <p className="form-hint-inline">
        At least 8 characters, including a letter and a number.
      </p>

      <label htmlFor="confirm">Confirm password</label>
      <PasswordInput
        id="confirm"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        required
        minLength={8}
        disabled={loading}
      />

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Resetting\u2026" : "Reset password"}
      </button>

      <p className="form-footer">
        <Link href="/login">Back to sign in</Link>
      </p>
    </form>
  );
}

// ── Router: choose step based on ?token= ─────────────────
function ForgotPasswordRouter() {
  const params = useSearchParams();
  const token = params.get("token");
  if (token) return <ResetForm token={token} />;
  return <RequestForm />;
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-form">
          <p className="muted">Loading…</p>
        </div>
      }
    >
      <ForgotPasswordRouter />
    </Suspense>
  );
}