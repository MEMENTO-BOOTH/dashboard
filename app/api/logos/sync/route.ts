import type { NextRequest } from "next/server";
import { z } from "zod";
import { uploadBarLogo } from "@/features/logos/cloudinary";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;

const watermarkSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  opacity: z.number().min(0).max(1),
});

function bearer(req: NextRequest): string {
  const auth = req.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : "";
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const token = bearer(req);
  if (!token) return Response.json({ error: "unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data: borne } = await supabase
    .from("bornes")
    .select("id, code")
    .eq("token", token)
    .maybeSingle();
  if (!borne) return Response.json({ error: "unknown_borne" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const watermarkRaw = form.get("watermark");
  if (!(file instanceof Blob) || typeof watermarkRaw !== "string") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) return Response.json({ error: "file_too_large" }, { status: 413 });

  const watermark = watermarkSchema.safeParse(parseJson(watermarkRaw));
  if (!watermark.success) return Response.json({ error: "invalid_watermark" }, { status: 400 });

  let logoUrl: string;
  try {
    logoUrl = await uploadBarLogo(borne.code, file);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return Response.json({ error: "cloudinary_failed", message }, { status: 502 });
  }

  const { error } = await supabase
    .from("bornes")
    .update({ logo_url: logoUrl, watermark: watermark.data })
    .eq("id", borne.id);
  if (error) {
    return Response.json({ error: "db_update_failed", message: error.message }, { status: 500 });
  }

  return Response.json({
    ok: true,
    code: borne.code,
    logoUrl,
    watermark: watermark.data,
  });
}
