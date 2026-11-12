"use client";

import Link from "next/link";
import type { Product } from "@/modules/shop/products/service";
import { useCart } from "@/lib/cart";

function currencySymbol(code?: string | null) {
  const c = (code ?? "GHS").toUpperCase();
  if (c === "GHS") return "GH₵";
  if (c === "USD") return "$";
  if (c === "EUR") return "€";
  if (c === "GBP") return "£";
  return c;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const cover = product.images?.[0] ?? "";
  const href = `/product/${product.slug}`;
  const currency = currencySymbol(product.currency);
  const outOfStock = product.stock <= 0;

  return (
    <Link href={href} className="product-card">
      <div
        className={cover ? "prc-image" : "prc-image prc-image-empty"}
        style={cover ? { backgroundImage: `url('${cover}')` } : undefined}
      >
        {product.category && (
          <span className="prc-cat">{product.category}</span>
        )}
        {outOfStock && (
          <span className="prc-stock prc-stock-out">Out of stock</span>
        )}
        <span className="prc-price-tag">
          <span className="prc-price-currency">{currency}</span>
          {Number(product.price).toLocaleString()}
        </span>
        {!outOfStock && (
          <button
            type="button"
            className="prc-quick-add"
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        )}
      </div>
      <div className="prc-body">
        <h3>{product.name}</h3>
        {product.description && (
          <p className="prc-desc">{product.description}</p>
        )}
        <span className="prc-link">
          View product
          <span className="material-symbols-outlined">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}