"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/modules/shop/products/service";
import { useCart } from "@/lib/cart";
import { useSession } from "@/modules/auth/useSession";

type DetailProps = {
  product: Product;
  related?: Product[];
};

function currencySymbol(code?: string | null) {
  const c = (code ?? "GHS").toUpperCase();
  if (c === "GHS") return "GH₵";
  if (c === "USD") return "$";
  if (c === "EUR") return "€";
  if (c === "GBP") return "£";
  return c;
}

export function ProductDetail({ product, related = [] }: DetailProps) {
  const { addToCart } = useCart();
  const { user } = useSession();
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const images = product.images ?? [];
  const cover = images[0] ?? "";
  const gallery = images.slice(1);
  const currency = currencySymbol(product.currency);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  const handleAdd = () => {
    if (outOfStock) return;
    if (!user) {
      router.push(`/login?next=/product/${product.slug}`);
      return;
    }
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="product-detail-hero">
        <div
          className="product-detail-hero-bg"
          style={cover ? { backgroundImage: `url('${cover}')` } : undefined}
        />
        <div className="product-detail-hero-overlay" />
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <Link href="/product">Shop</Link>
            <span className="dot">·</span>
            <span className="current">{product.name}</span>
          </nav>

          <div className="product-detail-hero-content">
            <div className="product-detail-hero-meta">
              {product.category && (
                <span className="product-detail-status">{product.category}</span>
              )}
              {outOfStock ? (
                <span className="product-detail-type product-detail-type-warn">
                  Out of stock
                </span>
              ) : lowStock ? (
                <span className="product-detail-type product-detail-type-warn">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="product-detail-type">
                  In stock · {product.stock}
                </span>
              )}
            </div>
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-detail-price">
              <span className="product-detail-price-currency">{currency}</span>
              <span className="product-detail-price-value">
                {Number(product.price).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="product-detail-body">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-detail-main">
              {product.description && (
                <div className="product-detail-section">
                  <p className="product-detail-kicker">About this product</p>
                  <h2>Description</h2>
                  <p className="product-detail-desc">{product.description}</p>
                </div>
              )}

              {gallery.length > 0 && (
                <div className="product-detail-section">
                  <p className="product-detail-kicker">Gallery</p>
                  <h2>More images</h2>
                  <div className="product-gallery">
                    {gallery.map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="product-gallery-item"
                        style={{ backgroundImage: `url('${src}')` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="product-detail-section">
                <p className="product-detail-kicker">Overview</p>
                <h2>Key details</h2>
                <div className="product-detail-facts">
                  {product.category && (
                    <div className="fact">
                      <span className="fact-label">Category</span>
                      <span className="fact-value">{product.category}</span>
                    </div>
                  )}
                  <div className="fact">
                    <span className="fact-label">Price</span>
                    <span className="fact-value">
                      {currency} {Number(product.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">Availability</span>
                    <span className="fact-value">
                      {outOfStock ? "Out of stock" : `${product.stock} in stock`}
                    </span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">SKU</span>
                    <span className="fact-value">{product.slug}</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="product-detail-sidebar">
              <div className="product-detail-card">
                <p className="product-detail-card-kicker">Price</p>
                <div className="product-detail-card-price">
                  <span>{currency}</span>
                  {Number(product.price).toLocaleString()}
                </div>

                <div className="product-qty">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, product.stock)}
                    value={qty}
                    onChange={(e) => {
                      const n = Number(e.target.value) || 1;
                      setQty(Math.min(Math.max(1, product.stock || 1), Math.max(1, n)));
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(Math.max(1, product.stock), q + 1))}
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="product-detail-card-cta"
                  onClick={handleAdd}
                  disabled={outOfStock}
                >
                  {added
                    ? "Added to cart ✓"
                    : outOfStock
                    ? "Out of stock"
                    : user
                    ? "Add to cart"
                    : "Sign in to buy"}
                  {!outOfStock && !added && (
                    <span className="material-symbols-outlined">shopping_cart</span>
                  )}
                </button>

                <Link href="/cart" className="product-detail-card-cta-ghost">
                  View cart
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>

                {lowStock && (
                  <p className="product-detail-card-note">
                    Only {product.stock} left — order soon.
                  </p>
                )}
              </div>

              <div className="product-detail-agent">
                <div className="product-detail-agent-avatar">T</div>
                <div>
                  <p className="product-detail-agent-name">Ted-Nomex Supplies</p>
                  <p className="product-detail-agent-role">Ships across Ghana</p>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="product-related">
              <div className="product-related-head">
                <h2>You may also need</h2>
                <Link href="/product" className="product-related-link">
                  View all products
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="product-grid">
                {related.map((p) => (
                  <ProductRelatedCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProductRelatedCard({ product }: { product: Product }) {
  const cover = product.images?.[0] ?? "";
  const currency = currencySymbol(product.currency);
  return (
    <Link href={`/product/${product.slug}`} className="product-card">
      <div
        className={cover ? "prc-image" : "prc-image prc-image-empty"}
        style={cover ? { backgroundImage: `url('${cover}')` } : undefined}
      >
        {product.category && <span className="prc-cat">{product.category}</span>}
        <span className="prc-price-tag">
          <span className="prc-price-currency">{currency}</span>
          {Number(product.price).toLocaleString()}
        </span>
      </div>
      <div className="prc-body">
        <h3>{product.name}</h3>
        {product.description && <p className="prc-desc">{product.description}</p>}
        <span className="prc-link">
          View product
          <span className="material-symbols-outlined">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}