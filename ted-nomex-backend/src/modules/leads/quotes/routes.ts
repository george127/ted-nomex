// src/modules/leads/quotes/routes.ts
import { Router } from "express";
import { createQuoteSchema, updateQuoteSchema, listQuotesQuerySchema } from "./schema.js";
import {
  createQuote, listQuotes, getQuoteById, listMyQuotes, updateQuote, deleteQuote,
} from "./service.js";
import { requireAdmin, requireAuth, optionalAuth } from "../../identity/index.js";

export const quotesRoutes = Router();

quotesRoutes.post("/", optionalAuth, async (req, res, next) => {
  try {
    const input = createQuoteSchema.parse(req.body);
    const quote = await createQuote(input, req.user?.userId);
    res.status(201).json(quote);
  } catch (err) { next(err); }
});

quotesRoutes.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const quotes = await listMyQuotes(req.user!.userId);
    res.json(quotes);
  } catch (err) { next(err); }
});

quotesRoutes.get("/admin/all", requireAdmin, async (req, res, next) => {
  try {
    const query = listQuotesQuerySchema.parse(req.query);
    const quotes = await listQuotes(query);
    res.json(quotes);
  } catch (err) { next(err); }
});

quotesRoutes.get("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    const quote = await getQuoteById(String(req.params.id));
    res.json(quote);
  } catch (err) { next(err); }
});

quotesRoutes.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const input = updateQuoteSchema.parse(req.body);
    const quote = await updateQuote(String(req.params.id), input);
    res.json(quote);
  } catch (err) { next(err); }
});

quotesRoutes.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await deleteQuote(String(req.params.id));
    res.json(result);
  } catch (err) { next(err); }
});