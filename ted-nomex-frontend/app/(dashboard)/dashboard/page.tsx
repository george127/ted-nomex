"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "@/styles/dashboard.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Counts = { orders: number; quotes: number; projects: number; enquiries: number };

export default function DashboardOverviewPage() {
  const [counts, setCounts] = useState<Counts>({ orders: 0, quotes: 0, projects: 0, enquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const safeFetch = async (path: string) => {
        try {
          const res = await fetch(`${API}${path}`, { credentials: "include" });
          if (!res.ok) return [];
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        } catch { return []; }
      };

      const [orders, quotes, enquiries] = await Promise.all([
        safeFetch("/api/orders/mine"),
        safeFetch("/api/quotes/mine"),
        safeFetch("/api/enquiries/mine"),
      ]);

      setCounts({
        orders: orders.length,
        quotes: quotes.filter((q: any) => q.status === "NEW" || q.status === "CONTACTED").length,
        projects: 0, // Project model was removed
        enquiries: enquiries.length,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { title: "Total orders", value: counts.orders, icon: "shopping_bag", href: "/dashboard/orders" },
    { title: "Open quotes", value: counts.quotes, icon: "request_quote", href: "/dashboard/quotes" },
    { title: "Enquiries", value: counts.enquiries, icon: "mail", href: "/dashboard/enquiries" },
  ];

  return (
    <div className="dash-overview">
      <header className="admin-page-head">
        <div>
          <h1>Overview</h1>
          <p>Your orders, quotes and messages in one place.</p>
        </div>
      </header>
      {loading ? (
        <p style={{ padding: 20, color: "var(--color-gray)" }}>Loading…</p>
      ) : (
        <div className="dash-grid">
          {cards.map((c) => (
            <Link key={c.title} href={c.href} className="stat-card">
              <span className="material-symbols-outlined">{c.icon}</span>
              <p className="stat-title">{c.title}</p>
              <p className="stat-value">{c.value}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}