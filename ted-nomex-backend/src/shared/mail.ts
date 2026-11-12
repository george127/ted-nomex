// src/shared/mail.ts
import { Resend } from "resend";
import { env } from "./env.js";
import { logger } from "./logger.js";

let resend: Resend | null = null;

function getClient(): Resend | null {
  if (resend) return resend;
  if (!env.RESEND_API_KEY) {
    logger.warn("RESEND_API_KEY not set - emails will be logged instead of sent");
    return null;
  }
  resend = new Resend(env.RESEND_API_KEY);
  return resend;
}

type SendParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(params: SendParams): Promise<void> {
  const client = getClient();
  const from = env.EMAIL_FROM ?? "Ted-Nomex <noreply@ted-nomex.com>";

  if (!client) {
    logger.info(`[DEV EMAIL] to=${params.to} subject="${params.subject}"`);
    logger.debug(params.text ?? params.html);
    return;
  }

  const { error } = await client.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });

  if (error) {
    logger.error("Resend send failed", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  logger.info(`Email sent to ${params.to}: ${params.subject}`);
}