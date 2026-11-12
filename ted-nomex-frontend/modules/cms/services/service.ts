// modules/cms/services/service.ts
import { apiFetch } from "@/lib/api-client";

export type Service = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  features: string[];
  tags: string[];
  bullets: string[];
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/cms/services?published=true");
}

export async function getService(slug: string): Promise<Service | null> {
  try { return await apiFetch<Service>(`/api/cms/services/${slug}`); }
  catch { return null; }
}

export async function listAllServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/cms/services/admin/all");
}

export async function getServiceById(id: string): Promise<Service> {
  return apiFetch<Service>(`/api/cms/services/admin/${id}`);
}

export type ServiceInput = {
  slug: string; title: string; excerpt: string; content: string;
  coverImage: string; features: string[]; tags: string[]; bullets: string[];
  order: number; published: boolean;
};

export async function createService(input: ServiceInput): Promise<Service> {
  return apiFetch<Service>("/api/cms/services", { method: "POST", body: input });
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<Service> {
  return apiFetch<Service>(`/api/cms/services/${id}`, { method: "PATCH", body: input });
}

export async function deleteService(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/cms/services/${id}`, { method: "DELETE" });
}