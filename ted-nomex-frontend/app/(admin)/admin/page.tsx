"use client";

import { useEffect, useState } from "react";
import {
  getAdminNews,
  getAdminProperties,
  getAdminProducts,
  getAdminServices,
  getAdminQuotes,
  getAdminOrders,
  getAdminUsers,
} from "@/lib/admin";
import "@/styles/admin.css";

async function safe<T>(fn: () => Promise<T[]>): Promise<number> {
  try {
    const arr = await fn();
    return arr.length;
  } catch {
    return 0;
  }
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState([
    { label: "News", href: "/admin/news", value: 0, icon: "newspaper" },
    { label: "Properties", href: "/admin/estate", value: 0, icon: "home_work" },
    { label: "Products", href: "/admin/products", value: 0, icon: "inventory_2" },
    { label: "Services", href: "/admin/services", value: 0, icon: "handyman" },
    { label: "Quotes", href: "/admin/quotes", value: 0, icon: "request_quote" },
    { label: "Orders", href: "/admin/orders", value: 0, icon: "shopping_bag" },
    { label: "Users", href: "/admin/users", value: 0, icon: "group" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [n, p, pr, s, q, o, u] = await Promise.all([
        safe(getAdminNews),
        safe(getAdminProperties),
        safe(getAdminProducts),
        safe(getAdminServices),
        safe(getAdminQuotes),
        safe(getAdminOrders),
        safe(getAdminUsers),
      ]);
      if (!alive) return;
      setStats([
        { label: "News", href: "/admin/news", value: n, icon: "newspaper" },
        { label: "Properties", href: "/admin/estate", value: p, icon: "home_work" },
        { label: "Products", href: "/admin/products", value: pr, icon: "inventory_2" },
        { label: "Services", href: "/admin/services", value: s, icon: "handyman" },
        { label: "Quotes", href: "/admin/quotes", value: q, icon: "request_quote" },
        { label: "Orders", href: "/admin/orders", value: o, icon: "shopping_bag" },
        { label: "Users", href: "/admin/users", value: u, icon: "group" },
      ]);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="admin-overview">
      <header className="admin-page-head">
        <div>
          <h1>Overview</h1>
          <p>Content, orders and users across the site.</p>
        </div>
      </header>

      <div className="admin-grid">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="admin-stat">
            <span className="material-symbols-outlined">{s.icon}</span>
            <p className="label">{s.label}</p>
            <p className="value">{loading ? "…" : s.value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}