// modules/cart/service.ts
"use client";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string | null;
  quantity: number;
  stock: number;
};

const STORAGE_KEY = "ted-nomex:cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function save(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-changed"));
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity = Math.min(item.stock, existing.quantity + quantity);
  } else {
    cart.push({ ...item, quantity: Math.min(item.stock, quantity) });
  }
  save(cart);
}

export function updateQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.quantity = Math.max(1, Math.min(item.stock, quantity));
  save(cart);
}

export function removeFromCart(productId: string) {
  save(getCart().filter((i) => i.productId !== productId));
}

export function clearCart() {
  save([]);
}

export function subscribeToCart(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => callback();
  window.addEventListener("cart-changed", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("cart-changed", onChange);
    window.removeEventListener("storage", onChange);
  };
}