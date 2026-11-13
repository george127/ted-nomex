"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/modules/shop/products/service";
import { useCart } from "@/lib/cart";
import { useSession } from "@/modules/auth/useSession";

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
  const { user } = useSession();
  const router = useRouter();

  const cover = product.images?.[0] ?? "";
  const href = `/product/${product.slug}`;
  const currency = currencySymbol(product.currency);
  const outOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?next=/product`);
      return;
    }
    addToCart(product, 1);
  };

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
            onClick={handleQuickAdd}
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