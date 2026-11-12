import { apiFetch } from "@/lib/api-client";

export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

export async function getSession(): Promise<SessionUser | null> {
  try { return await apiFetch<SessionUser>("/api/auth/session"); }
  catch { return null; }
}

export async function login(email: string, password: string) {
  return apiFetch<{ user: SessionUser }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function register(name: string, email: string, password: string) {
  return apiFetch<{ user: SessionUser }>("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export async function logout() {
  return apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}