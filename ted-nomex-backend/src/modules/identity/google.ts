// src/modules/identity/google.ts
import { OAuth2Client } from "google-auth-library";
import { env } from "../../shared/env.js";

if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    "⚠️  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Google sign-in will fail",
  );
}

const REDIRECT_URI = "http://localhost:4000/api/auth/google/callback";

const client = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
);

export function getGoogleAuthUrl(): string {
  return client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "consent",
  });
}

export async function getGoogleUser(code: string) {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("No email from Google payload");
  }

  return {
    email: payload.email,
    name: payload.name ?? null,
    picture: payload.picture ?? null,
  };
}