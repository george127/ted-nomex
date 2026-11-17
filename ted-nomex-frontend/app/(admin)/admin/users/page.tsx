"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUser } from "@/lib/admin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import "@/styles/admin.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getAdminUsers()
      .then((u) => { if (alive) setUsers(u); })
      .catch((err) => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Users</h1>
          <p>{users ? `${users.length} registered` : "Loading…"}</p>
        </div>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {!users && !error && <p style={{ padding: 20 }}>Loading…</p>}

      {users && users.length === 0 && (
        <div className="admin-empty">
          <span className="material-symbols-outlined">group</span>
          <h3>No users yet</h3>
          <p>Registered accounts will appear here.</p>
        </div>
      )}

      {users && users.length > 0 && (
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
                const initial = (u.name ?? u.email ?? "U").trim().charAt(0).toUpperCase();
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
                    <td><strong>{u.name ?? "—"}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-pill role-${u.role.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <StatusBadge variant={u.emailVerified ? "published" : "draft"} />
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