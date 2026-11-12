import { apiFetch } from "@/lib/api-client";

export async function submitEnquiry(payload: {
  name: string; email: string; phone?: string; message: string;
}): Promise<{ id: string }> {
  return apiFetch<{ id: string }>("/api/enquiries", {
    method: "POST",
    body: payload,
  });
}