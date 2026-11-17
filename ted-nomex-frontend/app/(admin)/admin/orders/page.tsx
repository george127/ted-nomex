"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, type AdminOrder } from "@/lib/admin";
import { StatusBadge, orderVariant } from "@/components/admin/StatusBadge";
import "@/styles/admin.css";

function formatMoney(amount: string, currency: string) {
  const n = Number(amount);
  const symbol = currency === "GHS" ? "GH₵" : currency;
  return `${symbol} ${n.toLocaleString()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getAdminOrders()
      .then((o) => { if (alive) setOrders(o); })
      .catch((err) => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Orders</h1>
          <p>{orders ? `${orders.length} total` : "Loading…"}</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {!orders && !error && <p style={{ padding: 20 }}>Loading…</p>}

      {orders && orders.length === 0 && (
        <div className="admin-empty">
          <span className="material-symbols-outlined">shopping_bag</span>
          <h3>No orders yet</h3>
          <p>Customer orders will appear here once someone checks out.</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><code>{o.id.slice(0, 8)}</code></td>
                  <td>
                    <div className="cell-stack">
                      <strong>{o.user?.name ?? o.email}</strong>
                      <span>{o.email}</span>
                    </div>
                  </td>
                  <td>{o.items.length}</td>
                  <td>{formatMoney(o.total, o.currency)}</td>
                  <td><StatusBadge variant={orderVariant(o.status)} /></td>
                  <td>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}