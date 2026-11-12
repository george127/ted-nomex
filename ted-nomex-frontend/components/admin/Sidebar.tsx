"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", icon: "space_dashboard" },
  { href: "/admin/orders", label: "Orders", icon: "shopping_bag" },
  { href: "/admin/quotes", label: "Quotes", icon: "request_quote" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "mail" },
  { href: "/admin/news", label: "News", icon: "newspaper" },
  { href: "/admin/services", label: "Services", icon: "handyman" },
  { href: "/admin/estate", label: "Estate", icon: "home_work" },
  { href: "/admin/products", label: "Products", icon: "inventory_2" },
  { href: "/admin/users", label: "Users", icon: "group" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-logo">
        Ted-Nomex
        <span>Admin</span>
      </Link>
      <nav>
        <ul>
          {links.map((l) => {
            const isActive =
              l.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link href={l.href} className={isActive ? "active" : ""}>
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