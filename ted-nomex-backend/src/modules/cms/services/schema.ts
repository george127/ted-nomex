// src/modules/cms/services/schema.ts
import { z } from "zod";

const arrayOfStrings = () =>
  z
    .array(z.string().trim().min(1))
    .default([])
    .transform((arr) => arr.filter((s) => s.length > 0));

export const createServiceSchema = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().trim().min(20),
  coverImage: z.string().url("Cover image must be a valid URL"),
  features: arrayOfStrings(),
  tags: arrayOfStrings(),
  bullets: arrayOfStrings(),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export const listServicesQuerySchema = z.object({
  published: z.enum(["true", "false", "all"]).default("true"),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ListServicesQuery = z.infer<typeof listServicesQuerySchema>;