"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatusBadge, orderVariant } from "@/components/admin/StatusBadge";
import "@/styles/dashboard.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type OrderItem = { id: string; title: string; quantity: number; price: string; image: string | null };
type Order = {
  id: string;
  items: OrderItem[];
  total: string;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

function formatMoney(amount: string, currency: string) {
  const symbol = currency === "GHS" ? "GH₵" : currency;
  return `${symbol} ${Number(amount).toLocaleString()}`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/orders/mine`, {
          credentials: "include",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.message ?? body?.error ?? `Failed (${res.status})`
          );
        }
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>My Orders</h1>
          <p>{orders.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {loading ? (
        <p style={{ padding: 20, color: "var(--color-gray)" }}>Loading…</p>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">shopping_bag</span>
          <h3>No orders yet</h3>
          <p>Your orders will appear here once you&apos;ve purchased from our shop.</p>
          <Link href="/product" className="admin-btn-primary">
            Browse the shop
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><code>{o.id.slice(0, 8)}</code></td>
                  <td>
                    <div className="cell-stack">
                      {o.items.slice(0, 2).map((item) => (
                        <span key={item.id}>{item.quantity}× {item.title}</span>
                      ))}
                      {o.items.length > 2 && <span>+{o.items.length - 2} more</span>}
                    </div>
                  </td>
                  <td>{formatMoney(o.total, o.currency)}</td>
                  <td><StatusBadge variant={orderVariant(o.status)} /></td>
                  <td>
                    <span
                      className={`status-badge ${
                        o.paymentStatus === "PAID"
                          ? "status-paid"
                          : o.paymentStatus === "FAILED"
                          ? "status-cancelled"
                          : "status-pending"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
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