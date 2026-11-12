// src/shared/errors.ts
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "./logger.js";
import { isProd } from "./env.js";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code: string = "BAD_REQUEST",
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2025"
  ) {
    res.status(404).json({
      message: "Resource not found",
      code: "NOT_FOUND",
    });
    return;
  }

  logger.error("Unhandled error", err);

  res.status(500).json({
    message: isProd ? "Internal server error" : (err as Error).message,
    code: "INTERNAL_ERROR",
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: "ROUTE_NOT_FOUND",
  });
}