import Link from "next/link";
import { getAdminOrders } from "@/lib/admin";
import { StatusBadge, orderVariant } from "@/components/admin/StatusBadge";
import "@/styles/admin.css";

export const metadata = { title: "Admin — Orders" };

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

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof getAdminOrders>> = [];
  let error: string | null = null;
  try {
    orders = await getAdminOrders();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load orders";
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">shopping_bag</span>
          <h3>No orders yet</h3>
          <p>Customer orders will appear here once someone checks out.</p>
        </div>
      ) : (
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
                  <td>
                    <code>{o.id.slice(0, 8)}</code>
                  </td>
                  <td>
                    <div className="cell-stack">
                      <strong>{o.user?.name ?? o.email}</strong>
                      <span>{o.email}</span>
                    </div>
                  </td>
                  <td>{o.items.length}</td>
                  <td>{formatMoney(o.total, o.currency)}</td>
                  <td>
                    <StatusBadge variant={orderVariant(o.status)} />
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