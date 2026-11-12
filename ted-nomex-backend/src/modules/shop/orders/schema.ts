// src/modules/shop/orders/schema.ts
import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(99),
});

const shippingSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z.string().trim().max(30).optional().nullable(),
  address: z.string().trim().min(4).max(300),
  city: z.string().trim().min(2).max(100),
  region: z.string().trim().max(100).optional().nullable(),
  country: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().max(30).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart is empty"),
  shipping: shippingSchema,
});

export const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]).optional(),
});

export const listOrdersQuerySchema = z.object({
  status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED", "all"]).default("all"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;