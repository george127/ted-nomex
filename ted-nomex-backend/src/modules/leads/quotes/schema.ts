// src/modules/leads/quotes/schema.ts
import { z } from "zod";

const inputsSchema = z.object({
  walls: z.coerce.number().min(0),
  area: z.coerce.number().min(0),
  windows: z.coerce.number().min(0),
  rooms: z.coerce.number().min(0),
  sqm: z.coerce.number().min(0),
  floors: z.coerce.number().min(0),
});

export const createQuoteSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z.string().trim().max(30).optional().nullable(),
  inputs: inputsSchema,
  estimate: z.coerce.number().min(0),
  currency: z.string().trim().default("GHS"),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const updateQuoteSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONVERTED", "CLOSED"]).optional(),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export const listQuotesQuerySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONVERTED", "CLOSED", "all"]).default("all"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type ListQuotesQuery = z.infer<typeof listQuotesQuerySchema>;