// src/modules/shop/products/schema.ts
import { z } from "zod";

const arrayOfStrings = z
  .array(z.string().trim().min(1))
  .default([])
  .transform((arr) => arr.filter((s) => s.length > 0));

export const createProductSchema = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  name: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10),
  price: z.coerce.number().positive(),
  currency: z.string().trim().default("GHS"),
  stock: z.coerce.number().int().min(0).default(0),
  images: arrayOfStrings,
  category: z.string().trim().max(80).nullable().optional(),
  published: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductsQuerySchema = z.object({
  published: z.enum(["true", "false", "all"]).default("true"),
  category: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;