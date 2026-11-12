"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/modules/auth/session";
import { useSession } from "@/modules/auth/useSession";
import { DashboardSidebar } from "./Sidebar";
import "@/styles/dashboard.css";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect unauthenticated users once the session has finished loading
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // While loading, or while redirect is in flight, show a neutral placeholder
  if (loading || !user) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "var(--color-gray)",
        }}
      >
        Loading…
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="dashboard-shell">
      <DashboardSidebar />
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="topbar-crumb">Dashboard</p>
            <p className="topbar-path">{pathname}</p>
          </div>
          <div className="topbar-user">
            <div>
              <strong>{user.name ?? user.email}</strong>
              <p>{user.email}</p>
            </div>
            <button onClick={handleLogout} className="logout-btn" type="button">
              Log out
            </button>
          </div>
        </header>
        <div className="dashboard-content">{children}</div>
        <footer className="dashboard-foot">
          <Link href="/">← Back to website</Link>
        </footer>
      </div>
    </div>
  );
}