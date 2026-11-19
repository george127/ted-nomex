// src/shared/mail.ts
import { env } from "./env.js";
import { logger } from "./logger.js";

type SendParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(params: SendParams): Promise<void> {
  const from = env.EMAIL_FROM ?? "Ted-Nomex <noreply@ted-nomex.com>";
  logger.info(`[EMAIL] to=${params.to} from=${from} subject="${params.subject}"`);
  logger.debug(params.text ?? params.html);
}