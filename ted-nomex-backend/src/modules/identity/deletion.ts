// src/modules/identity/deletion.ts
import jwt from "jsonwebtoken";
import { db } from "../../shared/db.js";
import { env } from "../../shared/env.js";
import { AppError } from "../../shared/errors.js";
import { sendEmail } from "../../shared/mail.js";
import { logger } from "../../shared/logger.js";

type DeletionPayload = {
  userId: string;
  purpose: "account-deletion";
};

const TOKEN_TTL_SECONDS = 24 * 60 * 60;

function signDeletionToken(userId: string): string {
  return jwt.sign(
    { userId, purpose: "account-deletion" } as DeletionPayload,
    env.JWT_SECRET,
    { expiresIn: "24h" },
  );
}

function verifyDeletionToken(token: string): DeletionPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded !== "object" || decoded === null) {
      throw new Error("invalid token");
    }
    const { userId, purpose } = decoded as Record<string, unknown>;
    if (typeof userId !== "string" || purpose !== "account-deletion") {
      throw new Error("invalid token payload");
    }
    return { userId, purpose: "account-deletion" };
  } catch {
    throw new AppError("Invalid or expired confirmation link", 400, "INVALID_TOKEN");
  }
}

export async function requestAccountDeletion(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, deletedAt: true, passwordHash: true },
  });

  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (user.deletedAt) throw new AppError("Account already deleted", 400, "ALREADY_DELETED");

  const token = signDeletionToken(user.id);
  const confirmUrl = `${env.FRONTEND_URL}/account/confirm-deletion?token=${token}`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #222;">
      <h2 style="margin: 0 0 16px; font-size: 22px;">Confirm account deletion</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #555;">
        Hi${user.name ? ` ${user.name}` : ""},
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #555;">
        We received a request to permanently delete your Ted-Nomex account.
        This action <strong>cannot be undone</strong>. Your profile information will be
        anonymized, and you will no longer be able to sign in.
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #555;">
        Order history and receipts will be retained for accounting purposes,
        but they will no longer be linked to your name.
      </p>
      <p style="margin: 32px 0;">
        <a href="${confirmUrl}" style="display: inline-block; background: #df962a; color: #1a1a1a; padding: 14px 28px; text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
          Confirm deletion
        </a>
      </p>
      <p style="font-size: 12px; line-height: 1.6; color: #999;">
        This link expires in 24 hours. If you didn't request this, you can safely
        ignore this email - nothing has been deleted yet.
      </p>
      <p style="font-size: 11px; color: #bbb; margin-top: 32px;">
        If the button doesn't work, paste this URL into your browser:<br/>
        <span style="word-break: break-all;">${confirmUrl}</span>
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Confirm your account deletion - Ted-Nomex",
    html,
  });

  logger.info(`Deletion email sent for user ${user.id}`);
}

export async function confirmAccountDeletion(token: string): Promise<void> {
  const payload = verifyDeletionToken(token);

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, deletedAt: true },
  });

  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  if (user.deletedAt) return;

  await db.user.update({
    where: { id: user.id },
    data: {
      deletedAt: new Date(),
      email: `deleted-${user.id}@ted-nomex.invalid`,
      name: "Deleted User",
      phone: null,
      image: null,
      passwordHash: null,
      emailVerified: null,
    },
  });

  logger.info(`Account ${user.id} soft-deleted`);
  await db.session.deleteMany({ where: { userId: user.id } });
}

export async function isUserDeleted(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { deletedAt: true },
  });
  return !!user?.deletedAt;
}

export { TOKEN_TTL_SECONDS };