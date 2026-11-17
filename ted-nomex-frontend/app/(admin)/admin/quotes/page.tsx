"use client";

import { useEffect, useState } from "react";
import { getAdminQuotes, type AdminQuote } from "@/lib/admin";
import { StatusBadge, quoteVariant } from "@/components/admin/StatusBadge";
import "@/styles/admin.css";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<AdminQuote[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getAdminQuotes()
      .then((q) => { if (alive) setQuotes(q); })
      .catch((err) => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Quotes</h1>
          <p>{quotes ? `${quotes.length} total` : "Loading…"}</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {!quotes && !error && <p style={{ padding: 20 }}>Loading…</p>}

      {quotes && quotes.length === 0 && (
        <div className="admin-empty">
          <span className="material-symbols-outlined">request_quote</span>
          <h3>No quotes yet</h3>
          <p>Quote calculator submissions will show up here.</p>
        </div>
      )}

      {quotes && quotes.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Estimate</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td><strong>{q.name}</strong></td>
                  <td>{q.email}</td>
                  <td>
                    {q.currency === "GHS" ? "GH₵" : q.currency}{" "}
                    {Number(q.estimate).toLocaleString()}
                  </td>
                  <td><StatusBadge variant={quoteVariant(q.status)} /></td>
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