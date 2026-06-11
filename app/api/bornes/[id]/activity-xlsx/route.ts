import type { NextRequest } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/features/auth/session";
import { getBorneDetail } from "@/features/bornes";
import { getBorneActivity } from "@/features/parc/api";
import { buildActivityWorkbook } from "@/features/parc/lib/xlsx";

export const runtime = "nodejs";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const querySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((v) => !Number.isNaN(Date.parse(`${v}T12:00:00Z`)), "invalid_date"),
});

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({ date: url.searchParams.get("date") ?? "" });
  if (!parsed.success) {
    return Response.json({ error: "invalid_date", expected: "YYYY-MM-DD" }, { status: 400 });
  }

  const { date } = parsed.data;
  const [borne, activity] = await Promise.all([getBorneDetail(id), getBorneActivity(id, date)]);

  const buffer = await buildActivityWorkbook(activity, `${borne.nom_lieu} (${borne.code})`, date);
  const safeName = borne.nom_lieu.replace(/[^a-zA-Z0-9-]/g, "_");
  const filename = `MementoBooth_${safeName}_${date}.xlsx`;

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": XLSX_MIME,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
