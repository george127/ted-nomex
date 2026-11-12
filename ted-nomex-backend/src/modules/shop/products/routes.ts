// src/modules/shop/products/routes.ts
import { Router } from "express";
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from "./schema.js";
import {
  listProducts, getProductBySlug, getProductById,
  createProduct, updateProduct, deleteProduct, getRelatedProducts,
} from "./service.js";
import { requireAdmin } from "../../identity/index.js";

export const productsRoutes = Router();

// Public
productsRoutes.get("/", async (req, res, next) => {
  try {
    const query = listProductsQuerySchema.parse(req.query);
    const products = await listProducts(query);
    res.json(products);
  } catch (err) { next(err); }
});

// Related must come BEFORE /:slug
productsRoutes.get("/:slug/related", async (req, res, next) => {
  try {
    const related = await getRelatedProducts(String(req.params.slug), 3);
    res.json(related);
  } catch (err) { next(err); }
});

// Admin — must come BEFORE /:slug
productsRoutes.get("/admin/all", requireAdmin, async (_req, res, next) => {
  try {
    const products = await listProducts({ published: "all", limit: 100, offset: 0 } as never);
    res.json(products);
  } catch (err) { next(err); }
});

productsRoutes.get("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const product = await getProductById(String(req.params.id));
    res.json(product);
  } catch (err) { next(err); }
});

productsRoutes.post("/", requireAdmin, async (req, res, next) => {
  try {
    const input = createProductSchema.parse(req.body);
    const product = await createProduct(input);
    res.status(201).json(product);
  } catch (err) { next(err); }
});

productsRoutes.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = updateProductSchema.parse(req.body);
    const product = await updateProduct(String(req.params.id), input);
    res.json(product);
  } catch (err) { next(err); }
});

productsRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteProduct(String(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

// Public by slug — MUST be last
productsRoutes.get("/:slug", async (req, res, next) => {
  try {
    const product = await getProductBySlug(String(req.params.slug));
    res.json(product);
  } catch (err) { next(err); }
});