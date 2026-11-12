import { getAdminUsers } from "@/lib/admin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import "@/styles/admin.css";

export const metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof getAdminUsers>> = [];
  let error: string | null = null;
  try {
    users = await getAdminUsers();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load users";
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Users</h1>
          <p>{users.length} registered</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {users.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">group</span>
          <h3>No users yet</h3>
          <p>Registered accounts will appear here.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const initial = (u.name ?? u.email ?? "U")
                  .trim()
                  .charAt(0)
                  .toUpperCase();
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="user-avatar">
                        {u.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.image} alt={u.name ?? u.email} />
                        ) : (
                          <span>{initial}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{u.name ?? "—"}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-pill role-${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <StatusBadge
                        variant={u.emailVerified ? "published" : "draft"}
                      />
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}