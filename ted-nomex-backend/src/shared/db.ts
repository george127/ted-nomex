// src/shared/db.ts
import { PrismaClient } from "@prisma/client";
import { isDev } from "./env.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDev ? ["warn", "error"] : ["error"],
  });

if (isDev) globalForPrisma.prisma = db;

export async function pingDatabase(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}