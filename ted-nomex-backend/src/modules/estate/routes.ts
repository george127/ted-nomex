// src/modules/estate/routes.ts
import { Router } from "express";
import { createPropertySchema, updatePropertySchema, listPropertiesQuerySchema } from "./schema.js";
import {
  listProperties, getPropertyById, getPropertyByIdAdmin,
  createProperty, updateProperty, deleteProperty,
} from "./service.js";
import { requireAdmin } from "../identity/index.js";

export const estateRoutes = Router();

// Public list
estateRoutes.get("/", async (req, res, next) => {
  try {
    const query = listPropertiesQuerySchema.parse(req.query);
    const properties = await listProperties(query);
    res.json(properties);
  } catch (err) { next(err); }
});

// Admin — must come before /:id
estateRoutes.get("/admin/all", requireAdmin, async (_req, res, next) => {
  try {
    const properties = await listProperties({
      published: "all", limit: 100, offset: 0,
    } as never);
    res.json(properties);
  } catch (err) { next(err); }
});

estateRoutes.get("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const property = await getPropertyByIdAdmin(String(req.params.id));
    res.json(property);
  } catch (err) { next(err); }
});

estateRoutes.post("/", requireAdmin, async (req, res, next) => {
  try {
    const input = createPropertySchema.parse(req.body);
    const property = await createProperty(input);
    res.status(201).json(property);
  } catch (err) { next(err); }
});

estateRoutes.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = updatePropertySchema.parse(req.body);
    const property = await updateProperty(String(req.params.id), input);
    res.json(property);
  } catch (err) { next(err); }
});

estateRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteProperty(String(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

// Public by id — MUST be last
estateRoutes.get("/:id", async (req, res, next) => {
  try {
    const property = await getPropertyById(String(req.params.id));
    res.json(property);
  } catch (err) { next(err); }
});