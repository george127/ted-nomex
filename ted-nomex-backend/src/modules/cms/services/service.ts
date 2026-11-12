// src/modules/cms/services/service.ts
import { db } from "../../../shared/db.js";
import { AppError } from "../../../shared/errors.js";
import type { CreateServiceInput, UpdateServiceInput, ListServicesQuery } from "./schema.js";

export async function listServices(query: ListServicesQuery) {
  const where: Record<string, unknown> = {};
  if (query.published !== "all") where.published = query.published === "true";

  return db.service.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getServiceBySlug(slug: string) {
  const service = await db.service.findUnique({ where: { slug } });
  if (!service) throw new AppError("Service not found", 404, "NOT_FOUND");
  if (!service.published) throw new AppError("Service not published", 404, "NOT_FOUND");
  return service;
}

export async function getServiceById(id: string) {
  const service = await db.service.findUnique({ where: { id } });
  if (!service) throw new AppError("Service not found", 404, "NOT_FOUND");
  return service;
}

export async function createService(input: CreateServiceInput) {
  const exists = await db.service.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (exists) throw new AppError(`A service with slug "${input.slug}" already exists`, 409, "SLUG_TAKEN");
  return db.service.create({ data: input });
}

export async function updateService(id: string, input: UpdateServiceInput) {
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) throw new AppError("Service not found", 404, "NOT_FOUND");

  if (input.slug && input.slug !== existing.slug) {
    const taken = await db.service.findUnique({ where: { slug: input.slug }, select: { id: true } });
    if (taken) throw new AppError(`A service with slug "${input.slug}" already exists`, 409, "SLUG_TAKEN");
  }

  return db.service.update({ where: { id }, data: input });
}

export async function deleteService(id: string) {
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) throw new AppError("Service not found", 404, "NOT_FOUND");
  await db.service.delete({ where: { id } });
  return { ok: true };
}