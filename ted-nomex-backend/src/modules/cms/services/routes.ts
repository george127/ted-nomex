// src/modules/cms/services/routes.ts
import { Router } from "express";
import { createServiceSchema, updateServiceSchema, listServicesQuerySchema } from "./schema.js";
import { listServices, getServiceBySlug, getServiceById, createService, updateService, deleteService } from "./service.js";
import { requireAdmin } from "../../identity/index.js";

export const servicesRoutes = Router();

// Public
servicesRoutes.get("/", async (req, res, next) => {
  try {
    const query = listServicesQuerySchema.parse(req.query);
    const services = await listServices(query);
    res.json(services);
  } catch (err) { next(err); }
});

// Admin — must come BEFORE "/:slug"
servicesRoutes.get("/admin/all", requireAdmin, async (_req, res, next) => {
  try {
    const services = await listServices({ published: "all" });
    res.json(services);
  } catch (err) { next(err); }
});

servicesRoutes.get("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const service = await getServiceById(String(req.params.id));
    res.json(service);
  } catch (err) { next(err); }
});

servicesRoutes.post("/", requireAdmin, async (req, res, next) => {
  try {
    const input = createServiceSchema.parse(req.body);
    const service = await createService(input);
    res.status(201).json(service);
  } catch (err) { next(err); }
});

servicesRoutes.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = updateServiceSchema.parse(req.body);
    const service = await updateService(String(req.params.id), input);
    res.json(service);
  } catch (err) { next(err); }
});

servicesRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteService(String(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});

// Public single — must come AFTER /admin/*
servicesRoutes.get("/:slug", async (req, res, next) => {
  try {
    const service = await getServiceBySlug(String(req.params.slug));
    res.json(service);
  } catch (err) { next(err); }
});