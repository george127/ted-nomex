"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import "@/styles/dashboard.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Enquiry = {
  id: string;
  subject: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
};

export default function DashboardEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/enquiries/mine`, {
          credentials: "include",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message ?? body?.error ?? `Failed (${res.status})`);
        }
        const data = await res.json();
        setEnquiries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load enquiries");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>My Enquiries</h1>
          <p>{enquiries.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {loading ? (
        <p style={{ padding: 20, color: "var(--color-gray)" }}>Loading…</p>
      ) : enquiries.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">mail</span>
          <h3>No enquiries yet</h3>
          <p>Your messages to the Ted-Nomex team will appear here.</p>
          <Link href="/contact" className="admin-btn-primary">
            Contact us
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.subject ?? "(no subject)"}</strong></td>
                  <td>
                    <div style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {e.message}
                    </div>
                  </td>
                  <td><StatusBadge variant={e.handled ? "handled" : "unhandled"} /></td>
                  <td>{new Date(e.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}