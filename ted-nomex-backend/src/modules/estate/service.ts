// src/modules/estate/service.ts
import { db } from "../../shared/db.js";
import { AppError } from "../../shared/errors.js";
import type { CreatePropertyInput, UpdatePropertyInput, ListPropertiesQuery } from "./schema.js";

export async function listProperties(query: ListPropertiesQuery) {
  const where: Record<string, unknown> = {};

  if (query.published !== "all") where.published = query.published === "true";
  if (query.status) where.status = query.status;
  if (query.location) where.location = query.location;
  if (query.type) where.type = query.type;
  if (query.style) where.style = query.style;

  if (query.minRooms !== undefined) where.rooms = { gte: query.minRooms };
  if (query.minBedrooms !== undefined) where.bedrooms = { gte: query.minBedrooms };
  if (query.minBathrooms !== undefined) where.bathrooms = { gte: query.minBathrooms };
  if (query.minParking !== undefined) where.parking = { gte: query.minParking };
  if (query.minArea !== undefined) where.area = { gte: query.minArea };
  if (query.maxPrice !== undefined) where.price = { lte: query.maxPrice };

  if (query.amenities) {
    const list = query.amenities.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length > 0) where.amenities = { hasEvery: list };
  }
  if (query.options) {
    const list = query.options.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length > 0) where.options = { hasEvery: list };
  }

  if (query.search) {
    const q = query.search.trim();
    if (q.length > 0) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { type: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
  }

  return db.property.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: query.limit,
    skip: query.offset,
  });
}

export async function getPropertyById(id: string) {
  const property = await db.property.findUnique({ where: { id } });
  if (!property) throw new AppError("Property not found", 404, "NOT_FOUND");
  if (!property.published) throw new AppError("Property not available", 404, "NOT_FOUND");
  return property;
}

export async function getPropertyByIdAdmin(id: string) {
  const property = await db.property.findUnique({ where: { id } });
  if (!property) throw new AppError("Property not found", 404, "NOT_FOUND");
  return property;
}

export async function createProperty(input: CreatePropertyInput) {
  return db.property.create({ data: input });
}

export async function updateProperty(id: string, input: UpdatePropertyInput) {
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing) throw new AppError("Property not found", 404, "NOT_FOUND");
  return db.property.update({ where: { id }, data: input });
}

export async function deleteProperty(id: string) {
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing) throw new AppError("Property not found", 404, "NOT_FOUND");
  await db.property.delete({ where: { id } });
  return { ok: true };
}