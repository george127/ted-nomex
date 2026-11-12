// src/modules/shop/orders/routes.ts
import { Router } from "express";
import { checkoutSchema, updateOrderSchema, listOrdersQuerySchema } from "./schema.js";
import {
  createOrder, getOrderById, getOrderByStripeSession,
  listMyOrders, listAllOrders, updateOrder, deleteOrder,
} from "./service.js";
import { createCheckoutSession } from "./stripe.js";
import { requireAdmin, requireAuth, optionalAuth } from "../../identity/index.js";
import { env } from "../../../shared/env.js";

export const checkoutRoutes = Router();

checkoutRoutes.post("/", optionalAuth, async (req, res, next) => {
  try {
    const input = checkoutSchema.parse(req.body);
    const { order, lineItems } = await createOrder(input, req.user?.userId ?? null);

    const session = await createCheckoutSession({
      orderId: order.id,
      lineItems: lineItems.map((li) => ({
        title: li.title, price: li.price, quantity: li.quantity, image: li.image,
      })),
      customerEmail: input.shipping.email,
      currency: order.currency,
      originUrl: env.FRONTEND_URL,
    });

    res.status(201).json({
      orderId: order.id,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (err) { next(err); }
});

export const ordersRoutes = Router();

ordersRoutes.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const orders = await listMyOrders(req.user!.userId);
    res.json(orders);
  } catch (err) { next(err); }
});

ordersRoutes.get("/by-session/:sessionId", async (req, res, next) => {
  try {
    const order = await getOrderByStripeSession(req.params.sessionId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { next(err); }
});

ordersRoutes.get("/admin/all", requireAdmin, async (req, res, next) => {
  try {
    const query = listOrdersQuerySchema.parse(req.query);
    const orders = await listAllOrders(query);
    res.json(orders);
  } catch (err) { next(err); }
});

ordersRoutes.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const order = await getOrderById(String(req.params.id));
    if (order.userId !== req.user!.userId && req.user!.role !== "ADMIN") {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) { next(err); }
});

ordersRoutes.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = updateOrderSchema.parse(req.body);
    const order = await updateOrder(String(req.params.id), input);
    res.json(order);
  } catch (err) { next(err); }
});

ordersRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteOrder(String(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});