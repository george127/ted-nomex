"use client";

// lib/cart.ts
// Thin adapter over @/modules/cart/service.
// This file exists only because checkout imports `useCart` from here.
// Do NOT add a second storage key — the service owns ted-nomex:cart.

import { useEffect, useState } from "react";
import type { Product } from "@/modules/shop/products/service";
import {
  getCart,
  addToCart as svcAdd,
  removeFromCart as svcRemove,
  updateQuantity as svcUpdate,
  clearCart as svcClear,
  subscribeToCart,
  type CartItem as ServiceCartItem,
} from "@/modules/cart/service";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string | null;
  quantity: number;
};

function toPublic(item: ServiceCartItem): CartItem {
  return {
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    price: Number(item.price),
    currency: item.currency,
    image: item.image,
    quantity: item.quantity,
  };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const refresh = () => setItems(getCart().map(toPublic));
    refresh();
    const unsub = subscribeToCart(refresh);
    return unsub;
  }, []);

  const addToCart = (product: Product, quantity = 1) => {
    svcAdd(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        currency: product.currency ?? "GHS",
        image: product.images?.[0] ?? null,
        stock: product.stock,
      },
      quantity
    );
  };

  const removeFromCart = (productId: string) => {
    svcRemove(productId);
  };

  const setQuantity = (productId: string, qty: number) => {
    svcUpdate(productId, qty);
  };

  const clear = () => svcClear();

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    setQuantity,
    clear,
    count,
    subtotal,
  };
}