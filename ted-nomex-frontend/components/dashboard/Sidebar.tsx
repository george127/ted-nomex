"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", icon: "space_dashboard" },
  { href: "/dashboard/orders", label: "Orders", icon: "shopping_bag" },
  { href: "/dashboard/quotes", label: "Quotes", icon: "request_quote" },
  { href: "/dashboard/projects", label: "Projects", icon: "apartment" },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: "mail" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar">
      <Link href="/dashboard" className="sidebar-logo">
        Ted-Nomex
      </Link>
      <nav>
        <ul>
          {links.map((l) => {
            const isActive =
              l.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={isActive ? "active" : ""}
                >
                  <span className="material-symbols-outlined">{l.icon}</span>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}