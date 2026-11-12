// src/modules/identity/routes.ts
import { Router } from "express";
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema } from "./schema.js";
import { register, login, getSessionUser, updateProfile, updatePassword, listUsers, adminDeleteUser } from "./service.js";
import { getGoogleAuthUrl, getGoogleUser } from "./google.js";
import {
  setSessionCookie,
  clearSessionCookie,
} from "../../shared/auth/cookies.js";
import { signToken } from "../../shared/auth/jwt.js";
import { requireAuth, optionalAuth, requireAdmin } from "../../shared/auth/middleware.js";
import { AppError } from "../../shared/errors.js";
import { db } from "../../shared/db.js";
import { requestAccountDeletion, confirmAccountDeletion } from "./deletion.js";
import { env } from "../../shared/env.js";

export const identityRoutes = Router();

// â”€â”€ Email / password â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

identityRoutes.post("/register", async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const { user, token } = await register(input);
    setSessionCookie(res, token);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

identityRoutes.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const { user, token } = await login(input);
    setSessionCookie(res, token);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

identityRoutes.post("/logout", optionalAuth, (_req, res) => {
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
});

identityRoutes.get("/session", requireAuth, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    const user = await getSessionUser(req.user.userId);
    const { isUserDeleted } = await import("./deletion.js");
    if (await isUserDeleted(req.user.userId)) {
      clearSessionCookie(res);
      throw new AppError("Account deleted", 401, "ACCOUNT_DELETED");
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// â”€â”€ Update profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

identityRoutes.put("/me/profile", requireAuth, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    const input = updateProfileSchema.parse(req.body);
    const user = await updateProfile(req.user.userId, input);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

identityRoutes.put("/me/password", requireAuth, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    const input = updatePasswordSchema.parse(req.body);
    await updatePassword(req.user.userId, input);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// â”€â”€ Account deletion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

identityRoutes.post("/me/delete-request", requireAuth, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    await requestAccountDeletion(req.user.userId);
    res.status(200).json({ ok: true, message: "Confirmation email sent" });
  } catch (err) {
    next(err);
  }
});

identityRoutes.post("/me/delete-confirm", async (req, res, next) => {
  try {
    const { token } = req.body as { token?: string };
    if (!token) throw new AppError("Missing token", 400, "MISSING_TOKEN");
    await confirmAccountDeletion(token);
    clearSessionCookie(res);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// â”€â”€ Admin: user management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

identityRoutes.get("/admin/users", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await listUsers();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
});

identityRoutes.delete("/admin/users/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);
    await adminDeleteUser(String(req.params.id), req.user.userId);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// â”€â”€ Google OAuth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Redirect user to Google
identityRoutes.get("/google", (_req, res) => {
  res.redirect(getGoogleAuthUrl());
});

// Google redirects back here with ?code=...
identityRoutes.get("/google/callback", async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code || typeof code !== "string") {
      throw new AppError("No authorization code from Google", 400, "NO_CODE");
    }

    const googleUser = await getGoogleUser(code);

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          role: "CUSTOMER",
          // passwordHash stays null for OAuth users
        },
      });
    } else if (!user.image && googleUser.picture) {
      // If existing user has no avatar, adopt Google's profile picture
      user = await db.user.update({
        where: { id: user.id },
        data: { image: googleUser.picture },
      });
    }

    // Sign JWT + set cookie â€” same flow as email login
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    setSessionCookie(res, token);

    // Redirect to frontend dashboard
    res.redirect(`${env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    next(err);
  }
});


// ══════════════════════════════════════════════════════════════
// PASSWORD RESET — token helpers + routes
// ══════════════════════════════════════════════════════════════
import jwtPkg from "jsonwebtoken";
import { sendEmail as sendResetEmail } from "../../shared/mail.js";
import { logger as resetLogger } from "../../shared/logger.js";
import { hashPassword as hashResetPassword } from "../../shared/auth/password.js";
import { forgotPasswordSchema, resetPasswordSchema } from "./schema.js";

type ResetPayload = {
  userId: string;
  email: string;
  purpose: "password-reset";
};

function signResetToken(userId: string, email: string): string {
  return jwtPkg.sign(
    { userId, email, purpose: "password-reset" } as ResetPayload,
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );
}

function verifyResetToken(token: string): ResetPayload {
  try {
    const decoded = jwtPkg.verify(token, env.JWT_SECRET);
    if (typeof decoded !== "object" || decoded === null) {
      throw new Error("invalid");
    }
    const { userId, email, purpose } = decoded as Record<string, unknown>;
    if (
      typeof userId !== "string" ||
      typeof email !== "string" ||
      purpose !== "password-reset"
    ) {
      throw new Error("invalid payload");
    }
    return { userId, email, purpose: "password-reset" };
  } catch {
    throw new AppError("Invalid or expired reset link", 400, "INVALID_RESET_TOKEN");
  }
}

identityRoutes.post("/forgot-password", async (req, res, next) => {
  try {
    const input = forgotPasswordSchema.parse(req.body);

    const user = await db.user.findUnique({
      where: { email: input.email },
      select: { id: true, email: true, name: true, deletedAt: true, passwordHash: true },
    });

    // Silent success for enumeration safety
    if (!user || user.deletedAt || !user.passwordHash) {
      resetLogger.info(`Password reset requested for non-resettable email: ${input.email}`);
      return res.status(200).json({
        ok: true,
        message: "If an account exists for that email, a reset link has been sent.",
      });
    }

    const token = signResetToken(user.id, user.email);
    const resetUrl = `${env.FRONTEND_URL}/forgot-password?token=${encodeURIComponent(token)}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #222;">
        <h2 style="margin: 0 0 16px; font-size: 22px;">Reset your Ted-Nomex password</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #555;">Hi${user.name ? ` ${user.name}` : ""},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #555;">We received a request to reset your password for <strong>${user.email}</strong>.</p>
        <p style="margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #df962a; color: #1a1a1a; padding: 14px 28px; text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Reset password</a>
        </p>
        <p style="font-size: 12px; color: #999;">This link expires in 1 hour. Ignore if you didn't request it.</p>
        <p style="font-size: 11px; color: #bbb;">${resetUrl}</p>
      </div>
    `;

    try {
      await sendResetEmail({
        to: user.email,
        subject: "Reset your Ted-Nomex password",
        html,
      });
    } catch (err) {
      resetLogger.error(`Failed to send reset email for ${user.email}`, err);
    }

    resetLogger.info(`Password reset email sent for user ${user.id}`);

    return res.status(200).json({
      ok: true,
      message: "If an account exists for that email, a reset link has been sent.",
      // In development we return the token/url so you can test without a verified Resend domain
      ...(env.NODE_ENV === "development"
        ? { devToken: token, resetUrl }
        : {}),
    });
  } catch (err) {
    next(err);
  }
});

identityRoutes.post("/reset-password", async (req, res, next) => {
  try {
    const input = resetPasswordSchema.parse(req.body);
    const payload = verifyResetToken(input.token);

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, deletedAt: true },
    });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    if (user.deletedAt) throw new AppError("Account deleted", 400, "ACCOUNT_DELETED");

    const newHash = await hashResetPassword(input.password);
    await db.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

    // Invalidate all existing sessions
    await db.session.deleteMany({ where: { userId: user.id } });

    resetLogger.info(`Password reset completed for user ${user.id}`);
    res.status(200).json({ ok: true, message: "Password updated." });
  } catch (err) {
    next(err);
  }
});