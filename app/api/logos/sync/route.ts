import type { NextRequest } from "next/server";
import { uploadBarLogo } from "@/features/logos/cloudinary";
import { type WatermarkElement, watermarkSchema } from "@/features/logos/schemas";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;

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

async function resolveImageElement(
  el: WatermarkElement,
  form: FormData,
  code: string,
): Promise<WatermarkElement | { error: Response }> {
  if (el.type !== "image") return el;
  const file = form.get(`file:${el.id}`);
  if (!(file instanceof Blob)) {
    return { error: Response.json({ error: "missing_file", elementId: el.id }, { status: 400 }) };
  }
  if (file.size > MAX_BYTES) {
    return { error: Response.json({ error: "file_too_large", elementId: el.id }, { status: 413 }) };
  }
  try {
    const imagePath = await uploadBarLogo(code, file, el.id);
    return { ...el, imagePath };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return { error: Response.json({ error: "cloudinary_failed", message }, { status: 502 }) };
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
  const watermarkRaw = form.get("watermark");
  if (typeof watermarkRaw !== "string") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const watermark = watermarkSchema.safeParse(parseJson(watermarkRaw));
  if (!watermark.success) return Response.json({ error: "invalid_watermark" }, { status: 400 });

  const resolved: WatermarkElement[] = [];
  for (const el of watermark.data.elements) {
    const result = await resolveImageElement(el, form, borne.code);
    if ("error" in result) return result.error;
    resolved.push(result);
  }

  const { error } = await supabase
    .from("bornes")
    .update({ watermark: { elements: resolved } })
    .eq("id", borne.id);
  if (error) {
    return Response.json({ error: "db_update_failed", message: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, code: borne.code, watermark: { elements: resolved } });
}
