"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { clearCart } from "@/modules/cart/service";
import "@/styles/checkout.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function currencySymbol(code?: string | null) {
  const c = (code ?? "GHS").toUpperCase();
  if (c === "GHS") return "GHâ‚µ";
  if (c === "USD") return "$";
  if (c === "EUR") return "â‚¬";
  if (c === "GBP") return "Â£";
  return c;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <section className="checkout-body">
        <div className="container">
          <div className="cart-empty">
            <span className="material-symbols-outlined">shopping_cart</span>
            <h1>Nothing to check out</h1>
            <p>Your cart is empty â€” add some products first.</p>
            <Link href="/product" className="cart-empty-cta">
              Browse products
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const handlePay = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          // Stripe will collect real name/email/address during checkout.
          // These placeholders satisfy the backend schema so the request
          // goes through; the webhook updates them after payment.
          shipping: {
            name: "Pending (collected at Stripe)",
            email: "pending@ted-nomex.local",
            phone: null,
            address: "Pending",
            city: "Pending",
            region: null,
            country: "Ghana",
            postalCode: null,
            notes: null,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Checkout failed");
      }
      if (data.checkoutUrl) {
        clear();
        clearCart();
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <section className="checkout-body">
      <div className="container">
        <nav className="hero-chip-dark" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="dot">Â·</span>
          <Link href="/cart">Cart</Link>
          <span className="dot">Â·</span>
          <span>Checkout</span>
        </nav>

        <div className="checkout-head">
          <h1>Checkout</h1>
          <p className="checkout-lead">
            Review your order and continue to our secure payment page.
          </p>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form">
                        <div className="checkout-section">
              <p className="checkout-kicker">Payment</p>
              <h2>How would you like to pay?</h2>
              <p className="checkout-hint">
                You&apos;ll be redirected to Stripe&apos;s secure checkout to enter your
                email, shipping address, and payment details. Nothing to fill out here.
              </p>

              <div className="checkout-stripe-note">
                <div className="checkout-stripe-note-icon">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div className="checkout-stripe-note-body">
                  <strong>Secure payment via Stripe</strong>
                  <p>
                    Cards, mobile money, and Apple Pay accepted. Your payment
                    details never touch our servers — Stripe handles them
                    end-to-end.
                  </p>
                  <div className="checkout-stripe-badges">
                    <span className="stripe-badge">
                      <span className="material-symbols-outlined">credit_card</span>
                      Cards
                    </span>
                    <span className="stripe-badge">
                      <span className="material-symbols-outlined">smartphone</span>
                      Mobile money
                    </span>
                    <span className="stripe-badge">
                      <span className="material-symbols-outlined">verified_user</span>
                      PCI-compliant
                    </span>
                    <span className="stripe-badge">
                      <span className="material-symbols-outlined">lock</span>
                      256-bit SSL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="checkout-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <button
              type="button"
              className="checkout-submit"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? "Redirecting to Stripeâ€¦" : "Pay with Stripe"}
              {!loading && <span className="material-symbols-outlined">lock</span>}
            </button>

            <Link href="/cart" className="checkout-back">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to cart
            </Link>
          </div>

          <aside className="checkout-summary">
            <div className="checkout-summary-card">
              <h2>Your order</h2>
              <div className="checkout-summary-items">
                {items.map((item) => {
                  const symbol = currencySymbol(item.currency);
                  return (
                    <div key={item.productId} className="checkout-summary-item">
                      <div className="checkout-summary-thumb">
                        {item.image ? (
                          <div style={{ backgroundImage: `url('${item.image}')` }} />
                        ) : (
                          <span className="material-symbols-outlined">inventory_2</span>
                        )}
                        <span className="checkout-summary-badge">{item.quantity}</span>
                      </div>
                      <div className="checkout-summary-meta">
                        <p className="checkout-summary-name">{item.name}</p>
                        <p className="checkout-summary-price">
                          {symbol}{" "}
                          {(Number(item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-summary-divider" />
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>
                  {currencySymbol(items[0]?.currency)}{" "}
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span>Shipping</span>
                <span className="cart-summary-free">Calculated at Stripe</span>
              </div>
              <div className="cart-summary-divider" />
              <div className="checkout-summary-row checkout-summary-total">
                <span>Total</span>
                <span>
                  {currencySymbol(items[0]?.currency)}{" "}
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="checkout-summary-note">
                You&apos;ll be redirected to Stripe to complete payment securely.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}