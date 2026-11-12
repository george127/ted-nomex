import { apiFetch } from "@/lib/api-client";

export type QuoteInputs = {
  wallsAndCeilings: string; area: number; windows: number;
  rooms: number; squareMetres: number; floors: number;
};

export type Quote = {
  id: string; name: string; email: string; phone: string | null;
  inputs: QuoteInputs; estimate: string; currency: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  createdAt: string;
};

export async function submitQuote(payload: {
  name: string; email: string; phone?: string; inputs: QuoteInputs;
}): Promise<Quote> {
  return apiFetch<Quote>("/api/quotes", { method: "POST", body: payload });
}
export async function listMyQuotes(): Promise<Quote[]> {
  return apiFetch<Quote[]>("/api/quotes/mine");
}