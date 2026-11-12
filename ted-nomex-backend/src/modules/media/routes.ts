// src/modules/media/routes.ts
import { Router } from "express";
import { signUploadSchema } from "./schema.js";
import { generateUploadSignature } from "../../shared/storage.js";
import { optionalAuth } from "../identity/index.js";
import { AppError } from "../../shared/errors.js";

export const mediaRoutes = Router();

mediaRoutes.post("/sign", optionalAuth, (req, res, next) => {
  try {
    const input = signUploadSchema.parse(req.body);

    const isAvatar = input.folder === "ted-nomex/avatars";
    const isAdmin = req.user?.role === "ADMIN";

    if (!isAvatar && !isAdmin) {
      throw new AppError(
        "Admin access required for this upload",
        403,
        "FORBIDDEN",
      );
    }

    res.json(
      generateUploadSignature({
        folder: input.folder,
        publicId: input.publicId,
        uploadPreset: input.uploadPreset,
      }),
    );
  } catch (err) {
    next(err);
  }
});