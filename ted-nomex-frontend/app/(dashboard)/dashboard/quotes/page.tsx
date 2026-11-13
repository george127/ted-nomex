"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge, quoteVariant } from "@/components/admin/StatusBadge";
import "@/styles/dashboard.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Quote = {
  id: string;
  estimate: string;
  currency: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

export default function DashboardQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/quotes/mine`, {
          credentials: "include",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message ?? body?.error ?? `Failed (${res.status})`);
        }
        const data = await res.json();
        setQuotes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load quotes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>My Quotes</h1>
          <p>{quotes.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {loading ? (
        <p style={{ padding: 20, color: "var(--color-gray)" }}>Loading…</p>
      ) : quotes.length === 0 ? (
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
                  <td><StatusBadge variant={quoteVariant(q.status)} /></td>
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