import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
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

export default async function DashboardEnquiriesPage() {
  let enquiries: any[] = [];
  let error: string | null = null;
  try {
    enquiries = await fetchWithAuth<any[]>("/api/enquiries/mine");
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load enquiries";
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>My Enquiries</h1>
          <p>{enquiries.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {enquiries.length === 0 ? (
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
                  <td>
                    <strong>{e.subject ?? "(no subject)"}</strong>
                  </td>
                  <td>
                    <div
                      style={{
                        maxWidth: 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.message}
                    </div>
                  </td>
                  <td>
                    <StatusBadge variant={e.handled ? "handled" : "unhandled"} />
                  </td>
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