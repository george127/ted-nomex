// modules/auth/session.ts â€” server-safe auth client.

export type SessionRole = "CUSTOMER" | "ADMIN";

export type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  role: SessionRole;
  image: string | null;
  phone: string | null;
  emailVerified: string | null;
  createdAt: string;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function parse(res: Response) {
  let body: any = null;
  try { body = await res.json(); } catch { body = null; }
  if (!res.ok) {
    const msg = body?.message ?? body?.error ?? `Request failed (${res.status})`;
    const err = new Error(msg) as Error & { code?: string; status?: number };
    err.code = body?.code ?? body?.errorCode;
    err.status = res.status;
    throw err;
  }
  return body;
}

export function notifyAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ted-auth-changed"));
  }
}

/**
 * getSession â€” works in BOTH Server and Client components.
 *
 * On the server: reads the incoming request's cookies via next/headers
 * and forwards them to the backend so /api/auth/session sees ted_session.
 *
 * On the client: normal fetch with credentials: "include".
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    // Detect server vs client
    const isServer = typeof window === "undefined";

    let cookieHeader: string | null = null;
    if (isServer) {
      // Dynamic import keeps this file importable from Client Components too
      const { cookies } = await import("next/headers");
      const store = await cookies(); // async in Next 15/16
      const all = store.getAll();
      cookieHeader = all.map((c) => `${c.name}=${c.value}`).join("; ");
    }

    const res = await fetch(`${API}/api/auth/session`, {
      method: "GET",
      credentials: isServer ? "omit" : "include",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.user ?? null;
  } catch {
    return null;
  }
}

// â”€â”€ Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function login(email: string, password: string): Promise<SessionUser> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parse(res);
  notifyAuthChanged();
  return data.user as SessionUser;
}

// â”€â”€ Register 
export async function register(
  name: string,
  email: string,
  password: string,
  phone?: string | null,
): Promise<SessionUser> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    // NOTE: no credentials — do not let the browser store the session cookie.
    // The user must sign in after registration.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone: phone ?? undefined }),
  });
  const data = await parse(res);
  // Do not notifyAuthChanged() — no session was set.
  return data.user as SessionUser;
}
// â”€â”€ Logout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function logout(): Promise<void> {
  try {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {}
  notifyAuthChanged();
}

// â”€â”€ Google OAuth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function getGoogleAuthUrl(): string {
  return `${API}/api/auth/google`;
}

// â”€â”€ Profile / password (used later) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function updateProfile(input: {
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
}): Promise<SessionUser> {
  const res = await fetch(`${API}/api/auth/me/profile`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parse(res);
  notifyAuthChanged();
  return data.user as SessionUser;
}

export async function updatePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const res = await fetch(`${API}/api/auth/me/password`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  await parse(res);
}

export async function requestAccountDeletion(): Promise<void> {
  const res = await fetch(`${API}/api/auth/me/delete-request`, {
    method: "POST",
    credentials: "include",
  });
  await parse(res);
}

// Legacy aliases
export const mockLogin = login;
export const mockRegister = register;
export function setSession(_user: SessionUser | null) {}
export function clearSession() {}


// ── Password reset ──────────────────────────────────────
export async function requestPasswordReset(email: string): Promise<{
  ok: true;
  message: string;
  devToken?: string;
  resetUrl?: string;
}> {
  const res = await fetch(`${API}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await parse(res);
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const res = await fetch(`${API}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  await parse(res);
}