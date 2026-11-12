// src/modules/cms/news/routes.ts
import { Router } from "express";
import { createNewsSchema, updateNewsSchema, listNewsQuerySchema } from "./schema.js";
import { listNews, getNewsBySlug, getNewsById, createNews, updateNews, deleteNews } from "./service.js";
import { requireAdmin } from "../../identity/index.js";

export const newsRoutes = Router();

// Public list
newsRoutes.get("/", async (req, res, next) => {
  try {
    const query = listNewsQuerySchema.parse(req.query);
    const posts = await listNews(query);
    res.json(posts);
  } catch (err) { next(err); }
});

// Admin routes MUST come before "/:slug"
newsRoutes.get("/admin/all", requireAdmin, async (req, res, next) => {
  try {
    const query = listNewsQuerySchema.parse({ ...req.query, published: "all" });
    const posts = await listNews(query);
    res.json(posts);
  } catch (err) { next(err); }
});

newsRoutes.get("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const post = await getNewsById(String(req.params.id));
    res.json(post);
  } catch (err) { next(err); }
});

newsRoutes.post("/", requireAdmin, async (req, res, next) => {
  try {
    const input = createNewsSchema.parse(req.body);
    const post = await createNews(input);
    res.status(201).json(post);
  } catch (err) { next(err); }
});

newsRoutes.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = updateNewsSchema.parse(req.body);
    const post = await updateNews(String(req.params.id), input);
    res.json(post);
  } catch (err) { next(err); }
});

newsRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteNews(String(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

// Public single — must come AFTER /admin/*
newsRoutes.get("/:slug", async (req, res, next) => {
  try {
    const post = await getNewsBySlug(String(req.params.slug));
    res.json(post);
  } catch (err) { next(err); }
});