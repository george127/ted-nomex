"use client";

import Link from "next/link";
import { useEffect } from "react";
import { clearCart } from "@/modules/cart/service";
import { useCart } from "@/lib/cart";
import "@/styles/checkout.css";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  // Belt-and-braces — checkout already cleared before redirect, this catches any
  // race where the browser preserved state across the Stripe round-trip.
  useEffect(() => {
    clear();
    clearCart();
  }, [clear]);

  return (
    <section className="checkout-body">
      <div className="container">
        <div className="checkout-success">
          <div className="checkout-success-icon">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <h1>Thank you — order received</h1>
          <p>
            Payment confirmed. We&apos;ve sent a receipt to your email and our team
            is preparing your order for delivery.
          </p>
          <div className="checkout-success-actions">
            <Link href="/dashboard/orders" className="cart-summary-cta">
              View my orders
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/product" className="cart-summary-ghost">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}