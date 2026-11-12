import Link from "next/link";
import "@/styles/auth.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <Link href="/" className="auth-brand-logo">
          Ted<span>-</span>Nomex
        </Link>
        <div className="auth-brand-body">
          <p className="auth-brand-eyebrow">Construction &amp; Real Estate</p>
          <h2 className="auth-brand-quote">
            Build with <span>confidence</span>,<br />
            from first sketch to handover.
          </h2>
          <p className="auth-brand-lead">
            Manage your projects, orders, quotes and enquiries from one
            dashboard. Trusted by hundreds of clients across Ghana.
          </p>
        </div>
        <div className="auth-brand-foot">
          <div>
            <strong>12+</strong>
            Years
          </div>
          <div>
            <strong>461</strong>
            Projects
          </div>
          <div>
            <strong>568</strong>
            Clients
          </div>
        </div>
      </aside>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <Link href="/" className="auth-logo">
            Ted-Nomex
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}