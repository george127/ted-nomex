// src/shared/storage.ts
import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

if (
  !env.CLOUDINARY_CLOUD_NAME ||
  !env.CLOUDINARY_API_KEY ||
  !env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "⚠️  Cloudinary credentials not set — upload endpoint will fail",
  );
}

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function generateUploadSignature(params: {
  folder?: string;
  publicId?: string;
  uploadPreset?: string;
}) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = params.folder ?? "ted-nomex";

  const toSign: Record<string, string | number> = {
    timestamp,
    folder,
  };

  if (params.uploadPreset) toSign.upload_preset = params.uploadPreset;
  if (params.publicId) toSign.public_id = params.publicId;

  const signature = cloudinary.utils.api_sign_request(
    toSign,
    env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    folder,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    ...(params.uploadPreset ? { uploadPreset: params.uploadPreset } : {}),
    ...(params.publicId ? { publicId: params.publicId } : {}),
  };
}

export async function deleteCloudinaryAsset(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("Failed to delete Cloudinary asset", publicId, err);
  }
}

export { cloudinary };