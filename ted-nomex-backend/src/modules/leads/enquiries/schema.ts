// src/modules/leads/enquiries/schema.ts
import { z } from "zod";

export const createEnquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z.string().trim().max(30).optional().nullable(),
  subject: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(10).max(5000),
});

export const updateEnquirySchema = z.object({
  handled: z.boolean().optional(),
});

export const listEnquiriesQuerySchema = z.object({
  handled: z.enum(["true", "false", "all"]).default("all"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;
export type ListEnquiriesQuery = z.infer<typeof listEnquiriesQuerySchema>;