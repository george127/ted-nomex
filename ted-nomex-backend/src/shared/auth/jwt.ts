// src/shared/auth/jwt.ts
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../env.js";

export type JwtPayload = {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded !== "object" || decoded === null) return null;

    const { userId, email, role } = decoded as Record<string, unknown>;
    if (
      typeof userId !== "string" ||
      typeof email !== "string" ||
      (role !== "CUSTOMER" && role !== "ADMIN")
    ) {
      return null;
    }
    return { userId, email, role };
  } catch {
    return null;
  }
}