// modules/cms/news/service.ts
import { apiFetch } from "@/lib/api-client";

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listNews(category?: string): Promise<NewsPost[]> {
  const qs = new URLSearchParams({ published: "true" });
  if (category) qs.set("category", category);
  return apiFetch<NewsPost[]>(`/api/cms/news?${qs}`);
}

export async function getNews(slug: string): Promise<NewsPost | null> {
  try { return await apiFetch<NewsPost>(`/api/cms/news/${slug}`); }
  catch { return null; }
}

export async function listAllNews(): Promise<NewsPost[]> {
  return apiFetch<NewsPost[]>("/api/cms/news/admin/all");
}

export async function getNewsById(id: string): Promise<NewsPost> {
  return apiFetch<NewsPost>(`/api/cms/news/admin/${id}`);
}

export async function createNews(input: {
  slug: string; title: string; excerpt: string; content: string;
  coverImage: string; category: string; published: boolean;
}): Promise<NewsPost> {
  return apiFetch<NewsPost>("/api/cms/news", { method: "POST", body: input });
}

export async function updateNews(id: string, input: Partial<{
  slug: string; title: string; excerpt: string; content: string;
  coverImage: string; category: string; published: boolean;
}>): Promise<NewsPost> {
  return apiFetch<NewsPost>(`/api/cms/news/${id}`, { method: "PATCH", body: input });
}

export async function deleteNews(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/api/cms/news/${id}`, { method: "DELETE" });
}