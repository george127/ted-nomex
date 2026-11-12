// src/modules/media/schema.ts
import { z } from "zod";

export const signUploadSchema = z.object({
  folder: z
    .enum([
      "ted-nomex/news",
      "ted-nomex/services",
      "ted-nomex/projects",
      "ted-nomex/estate",
      "ted-nomex/products",
      "ted-nomex/avatars",
    ])
    .default("ted-nomex/news"),
  publicId: z.string().trim().max(200).optional(),
  uploadPreset: z.string().trim().max(100).optional(),
});

export type SignUploadInput = z.infer<typeof signUploadSchema>;