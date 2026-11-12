import { getAdminEnquiries } from "@/lib/admin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import "@/styles/admin.css";

export const metadata = { title: "Admin — Enquiries" };

export default async function AdminEnquiriesPage() {
  let enquiries: Awaited<ReturnType<typeof getAdminEnquiries>> = [];
  let error: string | null = null;
  try {
    enquiries = await getAdminEnquiries();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load enquiries";
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Enquiries</h1>
          <p>{enquiries.length} total</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {enquiries.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">mail</span>
          <h3>No enquiries yet</h3>
          <p>Contact form submissions will appear here.</p>
        </div>
      ) : (
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
                  <td>
                    <strong>{e.name}</strong>
                  </td>
                  <td>{e.email}</td>
                  <td>{e.subject ?? "—"}</td>
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