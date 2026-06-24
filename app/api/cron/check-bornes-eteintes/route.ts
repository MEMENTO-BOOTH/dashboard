import "server-only";
import type { NextRequest } from "next/server";
import { cronQuerySchema, runCron } from "@/features/alertes-bornes-eteintes";
import { env } from "@/lib/env";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = cronQuerySchema.safeParse({
    dry: req.nextUrl.searchParams.get("dry") ?? undefined,
  });
  if (!parsed.success) {
    return Response.json({ error: "bad params" }, { status: 400 });
  }

  try {
    const result = await runCron(parsed.data.dry);
    return Response.json(result);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
