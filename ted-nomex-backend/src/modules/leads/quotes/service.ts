// src/modules/leads/quotes/service.ts
import { db } from "../../../shared/db.js";
import { AppError } from "../../../shared/errors.js";
import type { CreateQuoteInput, UpdateQuoteInput, ListQuotesQuery } from "./schema.js";

export async function createQuote(input: CreateQuoteInput, userId?: string) {
  return db.quote.create({
    data: {
      name: input.name, email: input.email, phone: input.phone ?? null,
      inputs: input.inputs, estimate: input.estimate, currency: input.currency,
      notes: input.notes ?? null, userId: userId ?? null,
    },
  });
}

export async function listQuotes(query: ListQuotesQuery) {
  const where: Record<string, unknown> = {};
  if (query.status !== "all") where.status = query.status;

  return db.quote.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: query.limit, skip: query.offset,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function getQuoteById(id: string) {
  const quote = await db.quote.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!quote) throw new AppError("Quote not found", 404, "NOT_FOUND");
  return quote;
}

export async function listMyQuotes(userId: string) {
  return db.quote.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function updateQuote(id: string, input: UpdateQuoteInput) {
  const existing = await db.quote.findUnique({ where: { id } });
  if (!existing) throw new AppError("Quote not found", 404, "NOT_FOUND");
  return db.quote.update({ where: { id }, data: input });
}

export async function deleteQuote(id: string) {
  const existing = await db.quote.findUnique({ where: { id } });
  if (!existing) throw new AppError("Quote not found", 404, "NOT_FOUND");
  await db.quote.delete({ where: { id } });
  return { ok: true };
}