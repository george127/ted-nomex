import { apiFetch } from "@/lib/api-client";
import type { Service } from "./service";

export async function listServicesCached(): Promise<Service[]> {
  // No "use cache" — fetch at request time.
  // This avoids build-time API failures caching an empty array.
  try {
    return await apiFetch<Service[]>("/api/cms/services?published=true");
  } catch {
    return [];
  }
}