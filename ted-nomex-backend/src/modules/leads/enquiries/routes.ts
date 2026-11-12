// src/modules/leads/enquiries/routes.ts
import { Router } from "express";
import { createEnquirySchema, updateEnquirySchema, listEnquiriesQuerySchema } from "./schema.js";
import {
  createEnquiry, listEnquiries, getEnquiryById, listMyEnquiries, updateEnquiry, deleteEnquiry,
} from "./service.js";
import { requireAdmin, requireAuth, optionalAuth } from "../../identity/index.js";

export const enquiriesRoutes = Router();

enquiriesRoutes.post("/", optionalAuth, async (req, res, next) => {
  try {
    const input = createEnquirySchema.parse(req.body);
    const enquiry = await createEnquiry(input, req.user?.userId);
    res.status(201).json(enquiry);
  } catch (err) { next(err); }
});

enquiriesRoutes.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const enquiries = await listMyEnquiries(req.user!.userId);
    res.json(enquiries);
  } catch (err) { next(err); }
});

enquiriesRoutes.get("/admin/all", requireAdmin, async (req, res, next) => {
  try {
    const query = listEnquiriesQuerySchema.parse(req.query);
    const enquiries = await listEnquiries(query);
    res.json(enquiries);
  } catch (err) { next(err); }
});

enquiriesRoutes.get("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const enquiry = await getEnquiryById(String(req.params.id));
    res.json(enquiry);
  } catch (err) { next(err); }
});

enquiriesRoutes.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = updateEnquirySchema.parse(req.body);
    const enquiry = await updateEnquiry(String(req.params.id), input);
    res.json(enquiry);
  } catch (err) { next(err); }
});

enquiriesRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteEnquiry(String(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});