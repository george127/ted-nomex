// src/modules/shop/orders/service.ts
import { db } from "../../../shared/db.js";
import { AppError } from "../../../shared/errors.js";
import type { CheckoutInput, UpdateOrderInput, ListOrdersQuery } from "./schema.js";

const orderInclude = { items: true } as const;

export async function validateCartAndGetProducts(input: CheckoutInput) {
  const productIds = input.items.map((i) => i.productId);

  const products = await db.product.findMany({
    where: { id: { in: productIds }, published: true },
  });

  if (products.length !== productIds.length) {
    throw new AppError("One or more products are no longer available", 400, "PRODUCT_UNAVAILABLE");
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  const lineItems: {
    productId: string; title: string; price: number; quantity: number;
    image: string | null; stock: number;
  }[] = [];

  for (const item of input.items) {
    const product = productMap.get(item.productId)!;
    if (product.stock < item.quantity) {
      throw new AppError(
        `Not enough stock for "${product.name}" (only ${product.stock} left)`,
        400, "OUT_OF_STOCK",
      );
    }
    const price = Number(product.price);
    subtotal += price * item.quantity;
    lineItems.push({
      productId: product.id, title: product.name, price,
      quantity: item.quantity, image: product.images[0] ?? null, stock: product.stock,
    });
  }

  return { lineItems, subtotal };
}

export async function createOrder(input: CheckoutInput, userId: string) {
  const { lineItems, subtotal } = await validateCartAndGetProducts(input);
  const shipping = 0;
  const total = subtotal + shipping;

  const order = await db.order.create({
    data: {
      userId,
      email: input.shipping.email,
      status: "PENDING",
      currency: "GHS",
      subtotal,
      total,
      shippingName: input.shipping.name,
      shippingAddress: input.shipping.address,
      shippingCity: input.shipping.city,
      shippingRegion: input.shipping.region ?? null,
      shippingCountry: input.shipping.country,
      shippingNotes: input.shipping.notes ?? null,
      items: {
        create: lineItems.map((li) => ({
          productId: li.productId, title: li.title, price: li.price,
          quantity: li.quantity, image: li.image,
        })),
      },
    },
    include: orderInclude,
  });

  return { order, lineItems };
}

export async function markOrderPaid(
  orderId: string, stripeSessionId: string, stripePaymentId: string | null,
  cardLast4: string | null, cardBrand: string | null,
) {
  const existing = await db.order.findUnique({ where: { id: orderId }, select: { status: true } });
  if (!existing) throw new AppError("Order not found", 404, "NOT_FOUND");
  if (existing.status === "PAID" || existing.status === "FULFILLED") return;

  await db.order.update({
    where: { id: orderId },
    data: {
      status: "PAID", paymentStatus: "PAID",
      stripeSession: stripeSessionId, stripePaymentId, cardLast4, cardBrand,
    },
  });

  const items = await db.orderItem.findMany({
    where: { orderId },
    select: { productId: true, quantity: true },
  });

  for (const item of items) {
    if (!item.productId) continue;
    await db.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }
}

export async function markOrderFailed(orderId: string) {
  await db.order.update({
    where: { id: orderId },
    data: { paymentStatus: "FAILED" },
  });
}

export async function getOrderById(id: string) {
  const order = await db.order.findUnique({ where: { id }, include: orderInclude });
  if (!order) throw new AppError("Order not found", 404, "NOT_FOUND");
  return order;
}

export async function getOrderByStripeSession(sessionId: string) {
  return db.order.findFirst({
    where: { stripeSession: sessionId },
    include: orderInclude,
  });
}

export async function listMyOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function listAllOrders(query: ListOrdersQuery) {
  const where: Record<string, unknown> = {};
  if (query.status !== "all") where.status = query.status;

  return db.order.findMany({
    where,
    include: { ...orderInclude, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: query.limit, skip: query.offset,
  });
}

export async function updateOrder(id: string, input: UpdateOrderInput) {
  const existing = await db.order.findUnique({ where: { id } });
  if (!existing) throw new AppError("Order not found", 404, "NOT_FOUND");
  return db.order.update({ where: { id }, data: input, include: orderInclude });
}

export async function deleteOrder(id: string) {
  const existing = await db.order.findUnique({ where: { id } });
  if (!existing) throw new AppError("Order not found", 404, "NOT_FOUND");
  await db.order.delete({ where: { id } });
  return { ok: true };
}