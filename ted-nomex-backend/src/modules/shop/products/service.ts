// src/modules/shop/products/service.ts
import { db } from "../../../shared/db.js";
import { AppError } from "../../../shared/errors.js";
import type { CreateProductInput, UpdateProductInput, ListProductsQuery } from "./schema.js";

export async function listProducts(query: ListProductsQuery) {
  const where: Record<string, unknown> = {};
  if (query.published !== "all") where.published = query.published === "true";
  if (query.category) where.category = query.category;

  if (query.search) {
    const q = query.search.trim();
    if (q.length > 0) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  return db.product.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: query.limit,
    skip: query.offset,
  });
}

export async function getProductBySlug(slug: string) {
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  if (!product.published) throw new AppError("Product not available", 404, "NOT_FOUND");
  return product;
}

export async function getProductById(id: string) {
  const product = await db.product.findUnique({ where: { id } });
  if (!product) throw new AppError("Product not found", 404, "NOT_FOUND");
  return product;
}

export async function createProduct(input: CreateProductInput) {
  const exists = await db.product.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (exists) throw new AppError(`A product with slug "${input.slug}" already exists`, 409, "SLUG_TAKEN");
  return db.product.create({ data: input });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) throw new AppError("Product not found", 404, "NOT_FOUND");

  if (input.slug && input.slug !== existing.slug) {
    const taken = await db.product.findUnique({ where: { slug: input.slug }, select: { id: true } });
    if (taken) throw new AppError(`A product with slug "${input.slug}" already exists`, 409, "SLUG_TAKEN");
  }

  return db.product.update({ where: { id }, data: input });
}

export async function deleteProduct(id: string) {
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) throw new AppError("Product not found", 404, "NOT_FOUND");
  await db.product.delete({ where: { id } });
  return { ok: true };
}

export async function getRelatedProducts(slug: string, limit = 3) {
  const current = await db.product.findUnique({ where: { slug } });
  if (!current) return [];

  const sameCategory = await db.product.findMany({
    where: { published: true, category: current.category, id: { not: current.id } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  if (sameCategory.length >= limit) return sameCategory;

  const otherCount = limit - sameCategory.length;
  const excludeIds = [current.id, ...sameCategory.map((p) => p.id)];

  const others = await db.product.findMany({
    where: { published: true, id: { notIn: excludeIds } },
    take: otherCount,
    orderBy: { createdAt: "desc" },
  });

  return [...sameCategory, ...others];
}