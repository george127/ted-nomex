"use client";

import { useEffect, useState } from "react";
import { getAdminEnquiries, type AdminEnquiry } from "@/lib/admin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import "@/styles/admin.css";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getAdminEnquiries()
      .then((e) => { if (alive) setEnquiries(e); })
      .catch((err) => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Enquiries</h1>
          <p>{enquiries ? `${enquiries.length} total` : "Loading…"}</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {!enquiries && !error && <p style={{ padding: 20 }}>Loading…</p>}

      {enquiries && enquiries.length === 0 && (
        <div className="admin-empty">
          <span className="material-symbols-outlined">mail</span>
          <h3>No enquiries yet</h3>
          <p>Contact form submissions will appear here.</p>
        </div>
      )}

      {enquiries && enquiries.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.email}</td>
                  <td>{e.subject ?? "—"}</td>
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