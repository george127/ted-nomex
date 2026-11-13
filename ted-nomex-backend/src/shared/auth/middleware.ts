// src/shared/auth/middleware.ts
import type { Request, Response, NextFunction } from "express";
import { SESSION_COOKIE } from "./cookies.js";
import { verifyToken, type JwtPayload } from "./jwt.js";
import { AppError } from "../errors.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function extractUser(req: Request): JwtPayload | null {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token || typeof token !== "string") return null;
  return verifyToken(token);
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const user = extractUser(req);
  if (!user) {
    return next(new AppError("Authentication required", 401, "UNAUTHENTICATED"));
  }
  req.user = user;
  next();
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const user = extractUser(req);
  if (!user) {
    return next(new AppError("Authentication required", 401, "UNAUTHENTICATED"));
  }
  if (user.role !== "ADMIN") {
    return next(new AppError("Admin access required", 403, "FORBIDDEN"));
  }
  req.user = user;
  next();
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const user = extractUser(req);
  if (user) req.user = user;
  next();
}

export async function rejectDeletedUsers(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) return next();
  const { db } = await import("../db.js");
  const found = await db.user.findUnique({
    where: { id: req.user.userId },
    select: { deletedAt: true },
  });
  if (found?.deletedAt) {
    return next(new AppError("Account deleted", 401, "ACCOUNT_DELETED"));
  }
  next();
}

export async function requireVerifiedEmail(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return next(new AppError("Authentication required", 401, "UNAUTHENTICATED"));
  }
  const { db } = await import("../db.js");
  const user = await db.user.findUnique({
    where: { id: req.user.userId },
    select: { emailVerified: true, deletedAt: true },
  });
  if (!user || user.deletedAt) {
    return next(new AppError("Account not available", 401, "ACCOUNT_UNAVAILABLE"));
  }
  if (!user.emailVerified) {
    return next(
      new AppError(
        "Please verify your email before ordering",
        403,
        "EMAIL_NOT_VERIFIED",
      ),
    );
  }
  next();
}