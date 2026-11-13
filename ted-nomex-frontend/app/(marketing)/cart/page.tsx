"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useSession } from "@/modules/auth/useSession";
import "@/styles/cart.css";

function currencySymbol(code?: string | null) {
  const c = (code ?? "GHS").toUpperCase();
  if (c === "GHS") return "GH₵";
  if (c === "USD") return "$";
  if (c === "EUR") return "€";
  if (c === "GBP") return "£";
  return c;
}

export default function CartPage() {
  const { items, setQuantity, removeFromCart, clear, subtotal } = useCart();
  const { user } = useSession();

  if (items.length === 0) {
    return (
      <section className="cart-body">
        <div className="container">
          <div className="cart-empty">
            <span className="material-symbols-outlined">shopping_cart</span>
            <h1>Your cart is empty</h1>
            <p>Browse the shop and add products to get started.</p>
            <Link href="/product" className="cart-empty-cta">
              Browse products
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-body">
      <div className="container">
        <nav className="hero-chip-dark" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="dot">.</span>
          <span>Cart</span>
        </nav>

        <div className="cart-head">
          <h1>Your cart</h1>
          <button type="button" className="cart-clear" onClick={clear}>
            Clear all
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const symbol = currencySymbol(item.currency);
              return (
                <div key={item.productId} className="cart-item">
                  <Link href={`/product/${item.slug}`} className="cart-item-image-wrap">
                    {item.image ? (
                      <div
                        className="cart-item-image"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                    ) : (
                      <div className="cart-item-image cart-item-image-empty">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                    )}
                  </Link>

                  <div className="cart-item-info">
                    <Link href={`/product/${item.slug}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <p className="cart-item-price">
                      {symbol} {Number(item.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="cart-item-qty">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      &minus;
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => setQuantity(item.productId, Number(e.target.value) || 1)}
                    />
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    {symbol} {(Number(item.price) * item.quantity).toLocaleString()}
                  </div>

                  <button
                    type="button"
                    className="cart-item-remove"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary-card">
              <h2>Order summary</h2>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{currencySymbol(items[0]?.currency)} {subtotal.toLocaleString()}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className="cart-summary-free">Calculated at checkout</span>
              </div>
              <div className="cart-summary-divider" />
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>{currencySymbol(items[0]?.currency)} {subtotal.toLocaleString()}</span>
              </div>

              {user ? (
                <Link href="/checkout" className="cart-summary-cta">
                  Proceed to checkout
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              ) : (
                <Link href="/login?next=/checkout" className="cart-summary-cta">
                  Sign in to checkout
                  <span className="material-symbols-outlined">login</span>
                </Link>
              )}

              <Link href="/product" className="cart-summary-ghost">
                Continue shopping
              </Link>

              <p className="cart-summary-note">
                Secure payment via Stripe. Cards and mobile money accepted.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}