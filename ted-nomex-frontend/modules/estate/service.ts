// modules/estate/service.ts
import { apiFetch } from "@/lib/api-client";

export type PropertyStatus = "For Rent" | "For Sale";

export type Property = {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  status: PropertyStatus;
  location: string;
  type: string;
  style: string | null;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  images: string[];
  amenities: string[];
  options: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EstateFilters = {
  search?: string; status?: string; location?: string; type?: string; style?: string;
  minRooms?: number; minBedrooms?: number; minBathrooms?: number; minParking?: number;
  minArea?: number; maxPrice?: number; amenities?: string[]; options?: string[];
};

export async function listProperties(filters: EstateFilters = {}): Promise<Property[]> {
  const qs = new URLSearchParams();
  qs.set("published", "true");
  if (filters.search) qs.set("search", filters.search);
  if (filters.status) qs.set("status", filters.status);
  if (filters.location) qs.set("location", filters.location);
  if (filters.type) qs.set("type", filters.type);
  if (filters.style) qs.set("style", filters.style);
  if (filters.minRooms) qs.set("minRooms", String(filters.minRooms));
  if (filters.minBedrooms) qs.set("minBedrooms", String(filters.minBedrooms));
  if (filters.minBathrooms) qs.set("minBathrooms", String(filters.minBathrooms));
  if (filters.minParking) qs.set("minParking", String(filters.minParking));
  if (filters.minArea) qs.set("minArea", String(filters.minArea));
  if (filters.maxPrice) qs.set("maxPrice", String(filters.maxPrice));
  if (filters.amenities?.length) qs.set("amenities", filters.amenities.join(","));
  if (filters.options?.length) qs.set("options", filters.options.join(","));
  return apiFetch<Property[]>(`/api/estate?${qs.toString()}`);
}

export async function getProperty(id: string): Promise<Property | null> {
  try { return await apiFetch<Property>(`/api/estate/${id}`); }
  catch { return null; }
}

export async function listAllProperties(): Promise<Property[]> {
  return apiFetch<Property[]>("/api/estate/admin/all");
}

export async function getPropertyById(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/estate/admin/${id}`);
}

export type PropertyInput = {
  title: string; description: string; price: number; currency: string;
  status: PropertyStatus; location: string; type: string; style: string | null;
  rooms: number; bedrooms: number; bathrooms: number; parking: number; area: number;
  images: string[]; amenities: string[]; options: string[]; published: boolean;
};

export async function createProperty(input: PropertyInput): Promise<Property> {
  return apiFetch<Property>("/api/estate", { method: "POST", body: input });
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<Property> {
  return apiFetch<Property>(`/api/estate/${id}`, { method: "PATCH", body: input });
}

export async function deleteProperty(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/estate/${id}`, { method: "DELETE" });
}