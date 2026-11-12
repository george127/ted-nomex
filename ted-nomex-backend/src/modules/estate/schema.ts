// src/modules/estate/schema.ts
import { z } from "zod";

const arrayOfStrings = z
  .array(z.string().trim().min(1))
  .default([])
  .transform((arr) => arr.filter((s) => s.length > 0));

export const createPropertySchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(20),
  price: z.coerce.number().positive(),
  currency: z.string().trim().default("GHS"),
  status: z.enum(["For Rent", "For Sale"]),
  location: z.string().trim().min(2).max(120),
  type: z.string().trim().min(2).max(80),
  style: z.string().trim().max(80).nullable().optional(),
  rooms: z.coerce.number().int().min(0),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  parking: z.coerce.number().int().min(0),
  area: z.coerce.number().int().min(0),
  images: arrayOfStrings,
  amenities: arrayOfStrings,
  options: arrayOfStrings,
  published: z.boolean().default(true),
});

export const updatePropertySchema = createPropertySchema.partial();

export const listPropertiesQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  style: z.string().optional(),
  minRooms: z.coerce.number().int().min(0).optional(),
  minBedrooms: z.coerce.number().int().min(0).optional(),
  minBathrooms: z.coerce.number().int().min(0).optional(),
  minParking: z.coerce.number().int().min(0).optional(),
  minArea: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  amenities: z.string().optional(),
  options: z.string().optional(),
  published: z.enum(["true", "false", "all"]).default("true"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type ListPropertiesQuery = z.infer<typeof listPropertiesQuerySchema>;