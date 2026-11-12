// src/shared/logger.ts
import { isProd } from "./env.js";

type Level = "info" | "warn" | "error" | "debug";

const COLORS: Record<Level, string> = {
  info: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  debug: "\x1b[90m",
};

const RESET = "\x1b[0m";

function log(level: Level, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();

  if (isProd) {
    console.log(
      JSON.stringify({
        timestamp,
        level,
        message,
        ...(meta && typeof meta === "object" ? { meta } : {}),
      }),
    );
    return;
  }

  const prefix = `${COLORS[level]}[${level.toUpperCase()}]${RESET}`;
  const time = `\x1b[90m${timestamp.split("T")[1].slice(0, 8)}${RESET}`;
  console.log(`${time} ${prefix} ${message}`);
  if (meta !== undefined) console.log(meta);
}

export const logger = {
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
};