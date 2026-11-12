// src/modules/leads/enquiries/service.ts
import { db } from "../../../shared/db.js";
import { AppError } from "../../../shared/errors.js";
import type { CreateEnquiryInput, UpdateEnquiryInput, ListEnquiriesQuery } from "./schema.js";

export async function createEnquiry(input: CreateEnquiryInput, userId?: string) {
  return db.enquiry.create({
    data: {
      name: input.name, email: input.email, phone: input.phone ?? null,
      subject: input.subject ?? null, message: input.message,
      userId: userId ?? null,
    },
  });
}

export async function listEnquiries(query: ListEnquiriesQuery) {
  const where: Record<string, unknown> = {};
  if (query.handled !== "all") where.handled = query.handled === "true";

  return db.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: query.limit, skip: query.offset,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function getEnquiryById(id: string) {
  const enquiry = await db.enquiry.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!enquiry) throw new AppError("Enquiry not found", 404, "NOT_FOUND");
  return enquiry;
}

export async function listMyEnquiries(userId: string) {
  return db.enquiry.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function updateEnquiry(id: string, input: UpdateEnquiryInput) {
  const existing = await db.enquiry.findUnique({ where: { id } });
  if (!existing) throw new AppError("Enquiry not found", 404, "NOT_FOUND");
  return db.enquiry.update({ where: { id }, data: input });
}

export async function deleteEnquiry(id: string) {
  const existing = await db.enquiry.findUnique({ where: { id } });
  if (!existing) throw new AppError("Enquiry not found", 404, "NOT_FOUND");
  await db.enquiry.delete({ where: { id } });
  return { ok: true };
}