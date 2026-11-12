import Link from "next/link";
import "@/styles/dashboard.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchWithAuth<T>(path: string): Promise<T> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const cookieHeader = store.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const res = await fetch(`${API}${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed (${res.status})`);
  return res.json();
}

async function safe<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    const r = await fn();
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}

export default async function DashboardOverviewPage() {
  const [orders, quotes, projects, enquiries] = await Promise.all([
    safe(() => fetchWithAuth<any[]>("/api/orders/mine")),
    safe(() => fetchWithAuth<any[]>("/api/quotes/mine")),
    safe(() => fetchWithAuth<any[]>("/api/projects/mine")),
    safe(() => fetchWithAuth<any[]>("/api/enquiries/mine")),
  ]);

  const openQuotes = quotes.filter((q) => q.status === "NEW" || q.status === "CONTACTED");
  const activeProjects = projects.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "PLANNING"
  );
  const openEnquiries = enquiries.filter((e) => !e.handled);

  const cards = [
    { title: "Total orders", value: orders.length, icon: "shopping_bag", href: "/dashboard/orders" },
    { title: "Open quotes", value: openQuotes.length, icon: "request_quote", href: "/dashboard/quotes", hint: `${quotes.length} total` },
    { title: "Active projects", value: activeProjects.length, icon: "apartment", href: "/dashboard/projects", hint: `${projects.length} total` },
    { title: "Enquiries", value: enquiries.length, icon: "mail", href: "/dashboard/enquiries", hint: `${openEnquiries.length} unanswered` },
  ];

  return (
    <div className="dash-overview">
      <header className="admin-page-head">
        <div>
          <h1>Overview</h1>
          <p>Your orders, quotes, projects and messages in one place.</p>
        </div>
      </header>

      <div className="dash-grid">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="stat-card">
            <span className="material-symbols-outlined">{c.icon}</span>
            <p className="stat-title">{c.title}</p>
            <p className="stat-value">{c.value}</p>
            {c.hint && <p className="stat-hint">{c.hint}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}