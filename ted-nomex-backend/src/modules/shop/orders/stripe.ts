// src/modules/shop/orders/stripe.ts
import Stripe from "stripe";
import { env } from "../../../shared/env.js";

if (!env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY not set — cannot initialize Stripe");
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-10-28.endive",
});

// ── Currency conversion (site = GHS, Stripe = configured charge currency) ──
// Site displays GHS prices to the customer. The order in DB stays GHS.
// Stripe session charges in STRIPE_CHARGE_CURRENCY (default: usd).
// Update STRIPE_GHS_TO_USD_RATE when the exchange rate drifts significantly.
const CHARGE_CURRENCY = (process.env.STRIPE_CHARGE_CURRENCY ?? "usd").toLowerCase();
const GHS_TO_USD_RATE = Number(process.env.STRIPE_GHS_TO_USD_RATE ?? "0.065");

function convertPriceToChargeAmount(ghsPrice: number): number {
  // Returns the smallest unit for the target currency (cents for USD/EUR/GBP).
  const usd = ghsPrice * GHS_TO_USD_RATE;
  return Math.max(50, Math.round(usd * 100)); // Stripe minimum = 50 cents
}

export async function createCheckoutSession(params: {
  orderId: string;
  lineItems: { title: string; price: number; quantity: number; image: string | null }[];
  customerEmail: string;
  currency: string;
  originUrl: string;
}) {
  // Convert every line item from GHS (site price) to the charge currency.
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    params.lineItems.map((item) => ({
      price_data: {
        currency: CHARGE_CURRENCY,
        product_data: {
          name: item.title,
          ...(item.image ? { images: [item.image] } : {}),
          description: `Original price: ${item.price.toLocaleString()} GHS`,
        },
        unit_amount: convertPriceToChargeAmount(item.price),
      },
      quantity: item.quantity,
    }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    customer_email: params.customerEmail,
    success_url: `${params.originUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.originUrl}/checkout/cancelled`,
    metadata: {
      orderId: params.orderId,
      originalCurrency: params.currency,
      conversionRate: String(GHS_TO_USD_RATE),
    },
  });

  return session;
}