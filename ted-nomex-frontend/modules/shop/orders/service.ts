// modules/shop/orders/service.ts
import { apiFetch } from "@/lib/api-client";
import type { CartItem } from "@/modules/cart/service";

export type OrderStatus = "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";

export type OrderItem = {
  id: string;
  productId: string | null;
  title: string;
  price: string;
  quantity: number;
  image: string | null;
};

export type Order = {
  id: string;
  userId: string | null;
  email: string;
  status: OrderStatus;
  currency: string;
  subtotal: string;
  total: string;
  paymentStatus: string;
  cardLast4: string | null;
  cardBrand: string | null;
  shippingName: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingRegion: string | null;
  shippingCountry: string | null;
  shippingNotes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string | null; email: string } | null;
};

export type CheckoutResponse = {
  orderId: string;
  checkoutUrl: string;
  sessionId: string;
};

export async function createCheckout(
  items: CartItem[],
  shipping: {
    name: string; email: string; phone?: string; address: string;
    city: string; region?: string; country: string;
    postalCode?: string; notes?: string;
  },
): Promise<CheckoutResponse> {
  return apiFetch<CheckoutResponse>("/api/checkout", {
    method: "POST",
    body: {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      shipping,
    },
  });
}

export async function getOrderBySession(sessionId: string): Promise<Order> {
  return apiFetch<Order>(`/api/orders/by-session/${sessionId}`);
}

export async function listMyOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders/mine");
}

export async function getMyOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}`);
}

export async function listAllOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders/admin/all");
}

export async function updateOrder(id: string, input: { status?: OrderStatus }): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}`, { method: "PATCH", body: input });
}