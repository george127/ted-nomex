// src/modules/shop/orders/webhooks.ts
import { Router, raw } from "express";
import Stripe from "stripe";
import { stripe } from "./stripe.js";
import { env } from "../../../shared/env.js";
import { logger } from "../../../shared/logger.js";
import { markOrderPaid, markOrderFailed } from "./service.js";

export const stripeWebhookRouter = Router();

stripeWebhookRouter.post("/", raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];

  if (!signature || typeof signature !== "string") {
    return res.status(400).json({ error: "Missing stripe-signature" });
  }
  if (!env.STRIPE_WEBHOOK_SECRET) {
    logger.error("STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook secret missing" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error("Webhook signature verification failed", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  logger.info(`Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (!orderId) {
          logger.warn("Stripe session missing orderId metadata");
          break;
        }

        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["payment_intent"],
        });

        const paymentIntent = full.payment_intent as Stripe.PaymentIntent | null;
        const charge = paymentIntent?.latest_charge as Stripe.Charge | null;
        const card = charge?.payment_method_details?.card;

        await markOrderPaid(
          orderId, session.id, paymentIntent?.id ?? null,
          card?.last4 ?? null, card?.brand ?? null,
        );
        logger.info(`Order ${orderId} marked PAID`);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) await markOrderFailed(orderId);
        break;
      }

      default:
        logger.debug(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    logger.error("Webhook handler error", err);
    res.status(500).json({ error: "Webhook handler error" });
  }
});