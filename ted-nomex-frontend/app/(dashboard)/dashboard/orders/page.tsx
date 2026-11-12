import Link from "next/link";
import { StatusBadge, orderVariant } from "@/components/admin/StatusBadge";
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

export default async function DashboardOrdersPage() {
  let orders: any[] = [];
  let error: string | null = null;
  try {
    orders = await fetchWithAuth<any[]>("/api/orders/mine");
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load orders";
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>My Orders</h1>
          <p>{orders.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {orders.length === 0 ? (
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
                  <td>
                    <code>{o.id.slice(0, 8)}</code>
                  </td>
                  <td>
                    <div className="cell-stack">
                      {o.items.slice(0, 2).map((item: any) => (
                        <span key={item.id}>
                          {item.quantity}× {item.title}
                        </span>
                      ))}
                      {o.items.length > 2 && <span>+{o.items.length - 2} more</span>}
                    </div>
                  </td>
                  <td>{formatMoney(o.total, o.currency)}</td>
                  <td>
                    <StatusBadge variant={orderVariant(o.status)} />
                  </td>
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