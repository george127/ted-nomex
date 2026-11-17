// lib/admin.ts — client-side admin fetchers.
// These run in the browser, so the backend's ted_session cookie
// is sent automatically with credentials: "include".

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

async function adminFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  } catch (err) {
    throw new Error(
      `Network error — could not reach the API. ` +
        (err instanceof Error ? err.message : ""),
    );
  }
  if (res.status === 401) {
    throw new Error(
      "Unauthorized — your session cookie was not accepted. Please log out and log in again.",
    );
  }
  if (res.status === 403) {
    throw new Error("Forbidden — your account is not an ADMIN.");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} — ${path} — ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// ── Shape mirrors ─────────────────────────────────────────────
export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  image: string | null;
  phone: string | null;
  emailVerified: string | null;
  deletedAt: string | null;
  createdAt: string;
};

export type AdminOrder = {
  id: string;
  userId: string | null;
  email: string;
  status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  currency: string;
  subtotal: string;
  total: string;
  paymentStatus: string;
  createdAt: string;
  items: {
    id: string;
    title: string;
    quantity: number;
    price: string;
    image: string | null;
  }[];
  user: { id: string; name: string | null; email: string } | null;
};

export type AdminQuote = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  estimate: string;
  currency: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  notes: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string } | null;
};

export type AdminEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string } | null;
};

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  published: boolean;
  progress: number;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
  startedAt: string | null;
  completedAt: string | null;
  clientId: string | null;
  createdAt: string;
  client: { id: string; name: string | null; email: string } | null;
};

export type AdminNews = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
};

export type AdminService = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  order: number;
  published: boolean;
  createdAt: string;
};

export type AdminProperty = {
  id: string;
  title: string;
  location: string;
  type: string;
  status: string;
  price: string;
  currency: string;
  published: boolean;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  price: string;
  currency: string;
  stock: number;
  published: boolean;
  createdAt: string;
};

// ── Fetchers ──────────────────────────────────────────────────
export const getAdminOrders = () =>
  adminFetch<AdminOrder[]>("/api/orders/admin/all?status=all&limit=100&offset=0");

export const getAdminQuotes = () =>
  adminFetch<AdminQuote[]>("/api/quotes/admin/all?status=all&limit=100&offset=0");

export const getAdminEnquiries = () =>
  adminFetch<AdminEnquiry[]>("/api/enquiries/admin/all?handled=all&limit=100&offset=0");

export const getAdminNews = () =>
  adminFetch<AdminNews[]>("/api/cms/news/admin/all?published=all");

export const getAdminServices = () =>
  adminFetch<AdminService[]>("/api/cms/services/admin/all");

export const getAdminProperties = () =>
  adminFetch<AdminProperty[]>("/api/estate/admin/all");

export const getAdminProducts = () =>
  adminFetch<AdminProduct[]>("/api/shop/products/admin/all");

export const getAdminUsers = async () => {
  const data = await adminFetch<{ users: AdminUser[] }>("/api/auth/admin/users");
  return data.users;
};