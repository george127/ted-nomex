import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="auth-form">
      <h1>Verify your email</h1>
      <p className="muted">
        We&apos;ve sent you a verification link. Open it to activate your
        account.
      </p>
      <p className="form-footer">
        <Link href="/login">Back to sign in</Link>
      </p>
    </div>
  );
}