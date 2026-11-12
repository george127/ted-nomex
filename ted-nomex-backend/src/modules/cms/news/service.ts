// src/modules/cms/news/service.ts
import { db } from "../../../shared/db.js";
import { AppError } from "../../../shared/errors.js";
import type { CreateNewsInput, UpdateNewsInput, ListNewsQuery } from "./schema.js";

const listSelect = {
  id: true, slug: true, title: true, excerpt: true, coverImage: true,
  category: true, published: true, publishedAt: true, createdAt: true,
  updatedAt: true, content: true,
} as const;

export async function listNews(query: ListNewsQuery) {
  const where: Record<string, unknown> = {};
  if (query.published !== "all") where.published = query.published === "true";
  if (query.category) where.category = query.category;

  return db.newsPost.findMany({
    where, select: listSelect,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: query.limit, skip: query.offset,
  });
}

export async function getNewsBySlug(slug: string) {
  const post = await db.newsPost.findUnique({ where: { slug } });
  if (!post) throw new AppError("News post not found", 404, "NOT_FOUND");
  if (!post.published) throw new AppError("News post not published", 404, "NOT_FOUND");
  return post;
}

export async function getNewsById(id: string) {
  const post = await db.newsPost.findUnique({ where: { id } });
  if (!post) throw new AppError("News post not found", 404, "NOT_FOUND");
  return post;
}

export async function createNews(input: CreateNewsInput) {
  const exists = await db.newsPost.findUnique({ where: { slug: input.slug }, select: { id: true } });
  if (exists) throw new AppError(`A news post with slug "${input.slug}" already exists`, 409, "SLUG_TAKEN");

  return db.newsPost.create({
    data: {
      slug: input.slug, title: input.title, excerpt: input.excerpt,
      content: input.content, coverImage: input.coverImage, category: input.category,
      published: input.published,
      publishedAt: input.published ? (input.publishedAt ? new Date(input.publishedAt) : new Date()) : null,
    },
  });
}

export async function updateNews(id: string, input: UpdateNewsInput) {
  const existing = await db.newsPost.findUnique({ where: { id } });
  if (!existing) throw new AppError("News post not found", 404, "NOT_FOUND");

  if (input.slug && input.slug !== existing.slug) {
    const taken = await db.newsPost.findUnique({ where: { slug: input.slug }, select: { id: true } });
    if (taken) throw new AppError(`A news post with slug "${input.slug}" already exists`, 409, "SLUG_TAKEN");
  }

  let publishedAt: Date | null | undefined = undefined;
  if (typeof input.published === "boolean") {
    if (input.published && !existing.published) publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();
    else if (!input.published) publishedAt = null;
  } else if (input.publishedAt !== undefined) {
    publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
  }

  return db.newsPost.update({
    where: { id },
    data: {
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.coverImage !== undefined && { coverImage: input.coverImage }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.published !== undefined && { published: input.published }),
      ...(publishedAt !== undefined && { publishedAt }),
    },
  });
}

export async function deleteNews(id: string) {
  const existing = await db.newsPost.findUnique({ where: { id } });
  if (!existing) throw new AppError("News post not found", 404, "NOT_FOUND");
  await db.newsPost.delete({ where: { id } });
  return { ok: true };
}