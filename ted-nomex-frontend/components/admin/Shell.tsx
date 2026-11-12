"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/modules/auth/session";
import { useSession } from "@/modules/auth/useSession";
import { AdminSidebar } from "./Sidebar";
import "@/styles/admin.css";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="topbar-crumb">Admin</p>
            <p className="topbar-path">{pathname}</p>
          </div>
          <div className="topbar-user">
            <div>
              <strong>{user?.name ?? user?.email ?? "Admin"}</strong>
              <p>{user?.email ?? ""}</p>
            </div>
            <button onClick={handleLogout} className="logout-btn" type="button">
              Log out
            </button>
          </div>
        </header>
        <div className="admin-content">{children}</div>
        <footer className="admin-foot">
          <Link href="/">← Back to website</Link>
          <span className="admin-foot-sep">·</span>
          <Link href="/dashboard">Customer view</Link>
        </footer>
      </div>
    </div>
  );
}