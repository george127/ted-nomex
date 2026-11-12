// src/modules/cms/news/schema.ts
import { z } from "zod";

export const createNewsSchema = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().trim().min(20),
  coverImage: z.string().url("Cover image must be a valid URL"),
  category: z.string().trim().min(2).max(80),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export const listNewsQuerySchema = z.object({
  published: z.enum(["true", "false", "all"]).default("true"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  category: z.string().optional(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type ListNewsQuery = z.infer<typeof listNewsQuerySchema>;