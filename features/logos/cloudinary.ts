import "server-only";

import { createHash } from "node:crypto";
import { env } from "@/lib/env";

const API_BASE = "https://api.cloudinary.com/v1_1";

function signParams(params: Record<string, string>, secret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${secret}`).digest("hex");
}

export function barLogoPublicId(code: string): string {
  return `bar_logo_${code}`;
}

export async function uploadBarLogo(code: string, file: Blob): Promise<string> {
  const key = env.CLOUDINARY_API_KEY;
  const secret = env.CLOUDINARY_API_SECRET;
  if (!(key && secret)) throw new Error("cloudinary_not_configured");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = barLogoPublicId(code);
  const signed = { overwrite: "true", public_id: publicId, timestamp };
  const signature = signParams(signed, secret);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", key);
  form.append("timestamp", timestamp);
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("signature", signature);

  const res = await fetch(`${API_BASE}/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`cloudinary_upload_failed_${res.status}`);
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("cloudinary_no_url");
  return data.secure_url;
}
