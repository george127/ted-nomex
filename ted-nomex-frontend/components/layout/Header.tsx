"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/modules/auth/session";
import { useSession } from "@/modules/auth/useSession";
import "@/styles/header.css";

export function Header() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  const displayName = user?.name ?? user?.email ?? "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";
  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const dashboardLabel = user?.role === "ADMIN" ? "Admin panel" : "Dashboard";

  return (
    <header className="header">
      <div className="container">
        <div className="link-container">
          <p>
            <span className="material-symbols-outlined">mail</span>
            <a href="mailto:info@ted-nomex.com">info@ted-nomex.com</a>
          </p>
          <p>
            <span className="material-symbols-outlined">location_on</span>
            <a
              href="https://maps.google.com/?q=GJ-275-7823"
              target="_blank"
              rel="noopener noreferrer"
            >
              GJ-275-7823
            </a>
          </p>
          <p>
            <span className="material-symbols-outlined">call</span>
            <a href="tel:0595808051">0595808051</a>
          </p>
        </div>

        <div className="Contact">
          <p>
            <span className="material-symbols-outlined">mail</span>
            <Link href="/contact">our contacts</Link>
          </p>
        </div>

        <div className="link-container">
          <div className="signIn-popUp">
            {loading ? (
              <span className="signin-loading" aria-hidden="true" />
            ) : user ? (
              <div
                className={`account-trigger ${open ? "is-open" : ""}`}
                ref={menuRef}
              >
                <button
                  type="button"
                  className="avatar-btn"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  <span className="avatar-circle">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name ?? user.email}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      initial
                    )}
                  </span>
                </button>

                <div className="dropdown" role="menu">
                  <div className="dropdown-head">
                    <div>
                      <p className="dropdown-name">
                        {user.name ?? user.email}
                      </p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    {user.role === "ADMIN" && (
                      <span className="admin-badge">Admin</span>
                    )}
                  </div>

                  <ul>
                    <li>
                      <Link
                        href={dashboardHref}
                        onClick={() => setOpen(false)}
                        role="menuitem"
                      >
                        <span className="material-symbols-outlined">
                          dashboard
                        </span>
                        {dashboardLabel}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                      >
                        <span className="material-symbols-outlined">
                          public
                        </span>
                        Back to website
                      </Link>
                    </li>
                  </ul>

                  <div className="dropdown-foot">
                    <ul>
                      <li>
                        <button
                          type="button"
                          onClick={onLogout}
                          role="menuitem"
                        >
                          <span className="material-symbols-outlined">
                            logout
                          </span>
                          Log out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="popUp">
                <span className="material-symbols-outlined">login</span>
                <p>SIGN IN</p>
              </Link>
            )}
          </div>

          <div className="social-media">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}