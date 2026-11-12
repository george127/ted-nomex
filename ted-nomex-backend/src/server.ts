// src/server.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./shared/env.js";
import { logger } from "./shared/logger.js";
import { pingDatabase } from "./shared/db.js";
import { errorHandler, notFoundHandler } from "./shared/errors.js";
import { identityRoutes } from "./modules/identity/index.js";
import { newsRoutes } from "./modules/cms/news/index.js";
import { servicesRoutes } from "./modules/cms/services/index.js";
import { estateRoutes } from "./modules/estate/index.js";
import { productsRoutes } from "./modules/shop/products/index.js";
import { quotesRoutes } from "./modules/leads/quotes/index.js";
import { enquiriesRoutes } from "./modules/leads/enquiries/index.js";
import { checkoutRoutes, ordersRoutes, stripeWebhookRouter } from "./modules/shop/orders/index.js";
import { mediaRoutes } from "./modules/media/index.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
app.use("/api/webhooks/stripe", stripeWebhookRouter);
app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true, limit: "5mb" }));
  app.use(cookieParser(env.COOKIE_SECRET));

  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });
 
  app.get("/health", async (_req, res) => {
    const dbOk = await pingDatabase();
    res.status(dbOk ? 200 : 503).json({
      status: dbOk ? "ok" : "degraded",
      db: dbOk ? "connected" : "unreachable",
      env: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/", (_req, res) => {
    res.json({
      name: "Ted-Nomex API",
      version: "0.1.0",
      docs: "/health",
    });
  });

  // Module routes
  app.use("/api/auth", identityRoutes);
  app.use("/api/cms/news", newsRoutes);
  app.use("/api/cms/services", servicesRoutes);
  app.use("/api/estate", estateRoutes);
  app.use("/api/shop/products", productsRoutes);
  app.use("/api/quotes", quotesRoutes);
  app.use("/api/enquiries", enquiriesRoutes);
  app.use("/api/checkout", checkoutRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/media", mediaRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}