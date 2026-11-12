import Link from "next/link";
import { StatusBadge, quoteVariant } from "@/components/admin/StatusBadge";
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

export default async function DashboardQuotesPage() {
  let quotes: any[] = [];
  let error: string | null = null;
  try {
    quotes = await fetchWithAuth<any[]>("/api/quotes/mine");
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load quotes";
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>My Quotes</h1>
          <p>{quotes.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {quotes.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">request_quote</span>
          <h3>No saved quotes</h3>
          <p>Save a cost estimate to keep it here for later.</p>
          <Link href="/cost" className="admin-btn-primary">
            Try the calculator
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Estimate</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td>
                    <strong>
                      {q.currency === "GHS" ? "GH₵" : q.currency}{" "}
                      {Number(q.estimate).toLocaleString()}
                    </strong>
                  </td>
                  <td>
                    <StatusBadge variant={quoteVariant(q.status)} />
                  </td>
                  <td>{q.notes ?? "—"}</td>
                  <td>{new Date(q.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}