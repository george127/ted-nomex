import { cacheLife } from "next/cache";
import { apiFetch } from "@/lib/api-client";
import type { Service } from "./service";

export async function listServicesCached(): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  try {
    return await apiFetch<Service[]>("/api/cms/services?published=true");
  } catch {
    return [];
  }
}