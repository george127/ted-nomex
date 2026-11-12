// lib/admin.ts â€” server-side admin fetchers with cookie forwarding.

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function adminFetch<T>(path: string): Promise<T> {
  const url = `${API}${path}`;

  // On the server (Server Component / layout), credentials:"include" does
  // nothing â€” Node's fetch has no cookie jar. We must forward the incoming
  // request's cookies as a Cookie header.
  const isServer = typeof window === "undefined";
  let cookieHeader: string | null = null;

  if (isServer) {
    const { cookies } = await import("next/headers");
    const store = await cookies(); // async in Next.js 15+
    cookieHeader = store
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  }

  const res = await fetch(url, {
    method: "GET",
    credentials: isServer ? "omit" : "include",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error(
      `Unauthorized â€” ted_session cookie not present in request to ${path}`
    );
  }
  if (res.status === 403) {
    throw new Error(`Forbidden â€” user is not an ADMIN (${path})`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} â€” ${path} â€” ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// â”€â”€ Shape mirrors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  items: { id: string; title: string; quantity: number; price: string; image: string | null }[];
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

// â”€â”€ Fetchers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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