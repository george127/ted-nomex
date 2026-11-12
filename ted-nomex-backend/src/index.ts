// src/index.ts
import { createApp } from "./server.js";
import { env } from "./shared/env.js";
import { logger } from "./shared/logger.js";
import { db, pingDatabase } from "./shared/db.js";

async function main() {
  const app = createApp();

  const dbOk = await pingDatabase();
  if (!dbOk) {
    logger.error("❌ Database unreachable. Check DATABASE_URL and Neon status.");
    process.exit(1);
  }
  logger.info("✅ Database connected");

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 API listening on http://localhost:${env.PORT}`);
    logger.info(`   Environment: ${env.NODE_ENV}`);
    logger.info(`   Frontend origin: ${env.FRONTEND_URL}`);
  });

  const shutdown = async (signal: string) => {
    logger.warn(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await db.$disconnect();
      logger.info("Server closed, DB disconnected");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled rejection", reason);
  });
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception", err);
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error("Fatal startup error", err);
  process.exit(1);
});