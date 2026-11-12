// src/modules/identity/service.ts
import { db } from "../../shared/db.js";
import { hashPassword, verifyPassword } from "../../shared/auth/password.js";
import { signToken, type JwtPayload } from "../../shared/auth/jwt.js";
import { AppError } from "../../shared/errors.js";
import type { RegisterInput, LoginInput, UpdateProfileInput, UpdatePasswordInput } from "./schema.js";

export type PublicUser = {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  image: string | null;
  phone: string | null;
  emailVerified: string | null;
  createdAt: string;
};

function toPublic(user: {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  image: string | null;
  phone: string | null;
  emailVerified: Date | null;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    phone: user.phone,
    emailVerified: user.emailVerified?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function register(input: RegisterInput): Promise<{
  user: PublicUser;
  token: string;
}> {
  const existing = await db.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existing) {
    throw new AppError(
      "An account with this email already exists",
      409,
      "EMAIL_TAKEN",
    );
  }

  const passwordHash = await hashPassword(input.password);

  const created = await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone ?? null,
      image: input.image ?? null,
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  const payload: JwtPayload = {
    userId: created.id,
    email: created.email,
    role: created.role,
  };
  const token = signToken(payload);

  return { user: toPublic(created), token };
}

export async function login(input: LoginInput): Promise<{
  user: PublicUser;
  token: string;
}> {
  const found = await db.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
      passwordHash: true,
    },
  });

  if (!found || !found.passwordHash) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const ok = await verifyPassword(input.password, found.passwordHash);
  if (!ok) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const { passwordHash: _hash, ...rest } = found;
  const payload: JwtPayload = {
    userId: rest.id,
    email: rest.email,
    role: rest.role,
  };
  const token = signToken(payload);

  return { user: toPublic(rest), token };
}

export async function getSessionUser(userId: string): Promise<PublicUser> {
  const found = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!found) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return toPublic(found);
}

// ── Update profile ────────────────────────────────────

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<PublicUser> {
  const existing = await db.user.findUnique({ where: { id: userId } });
  if (!existing) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (input.email !== existing.email) {
    const taken = await db.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (taken) {
      throw new AppError(
        "An account with this email already exists",
        409,
        "EMAIL_TAKEN",
      );
    }
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      image: input.image === undefined ? existing.image : input.image,
    },
    select: {
      id: true, name: true, email: true, role: true, image: true,
      phone: true, emailVerified: true, createdAt: true,
    },
  });

  return toPublic(updated);
}

export async function updatePassword(
  userId: string,
  input: UpdatePasswordInput,
): Promise<void> {
  const found = await db.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!found) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  if (!found.passwordHash) {
    throw new AppError(
      "This account uses Google sign-in. Password cannot be changed here.",
      400, "OAUTH_USER",
    );
  }

  const ok = await verifyPassword(input.currentPassword, found.passwordHash);
  if (!ok) throw new AppError("Current password is incorrect", 401, "INVALID_PASSWORD");

  const newHash = await hashPassword(input.newPassword);
  await db.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
}

// ── Admin: user management ────────────────────────────

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  image: string | null;
  phone: string | null;
  emailVerified: string | null;
  deletedAt: string | null;
  createdAt: string;
};

export async function listUsers(): Promise<AdminUserRow[]> {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      phone: true,
      emailVerified: true,
      deletedAt: true,
      createdAt: true,
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    image: u.image,
    phone: u.phone,
    emailVerified: u.emailVerified ? u.emailVerified.toISOString() : null,
    deletedAt: u.deletedAt ? u.deletedAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function adminDeleteUser(
  targetUserId: string,
  actingAdminId: string,
): Promise<void> {
  if (targetUserId === actingAdminId) {
    throw new AppError(
      "You cannot delete your own account from here",
      400,
      "SELF_DELETE",
    );
  }

  const target = await db.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, deletedAt: true },
  });
  if (!target) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  if (target.deletedAt) {
    // Already deleted — treat as success
    return;
  }

  // Soft-delete the same way the self-service flow does
  await db.user.update({
    where: { id: targetUserId },
    data: {
      deletedAt: new Date(),
      email: `deleted-${targetUserId}@ted-nomex.invalid`,
      name: "Deleted User",
      phone: null,
      image: null,
      passwordHash: null,
      emailVerified: null,
    },
  });

  await db.session.deleteMany({ where: { userId: targetUserId } });
}