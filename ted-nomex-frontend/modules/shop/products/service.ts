// modules/shop/products/service.ts
import { apiFetch } from "@/lib/api-client";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  stock: number;
  images: string[];
  category: string | null;
  published: boolean;
};

export async function listProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/shop/products");
}

export async function getProduct(slug: string): Promise<Product | null> {
  try { return await apiFetch<Product>(`/api/shop/products/${slug}`); }
  catch { return null; }
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  try { return await apiFetch<Product[]>(`/api/shop/products/${slug}/related?limit=${limit}`); }
  catch { return []; }
}

export async function listAllProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/shop/products/admin/all");
}

export async function getProductById(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/shop/products/admin/${id}`);
}

export type ProductInput = {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  category: string | null;
  published: boolean;
};

export async function createProduct(input: ProductInput): Promise<Product> {
  return apiFetch<Product>("/api/shop/products", { method: "POST", body: input });
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  return apiFetch<Product>(`/api/shop/products/${id}`, { method: "PATCH", body: input });
}

export async function deleteProduct(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/shop/products/${id}`, { method: "DELETE" });
}