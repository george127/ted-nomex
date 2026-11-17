// src/shared/auth/cookies.ts
import type { Response } from "express";
import { isProd } from "../env.js";

export const SESSION_COOKIE = "ted_session";

const baseOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/",
  // IMPORTANT: do NOT set domain. A host-only cookie is correct.
  // Setting domain=.onrender.com is rejected by browsers because
  // onrender.com is on the public suffix list.
} as const;

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    ...baseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, baseOptions);
}