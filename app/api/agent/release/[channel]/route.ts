import type { NextRequest } from "next/server";
import { channelSchema, fetchLatestRelease } from "@/features/releases";
import { env } from "@/lib/env";

function unauthorized() {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  if (!env.AGENT_API_TOKEN) return true;
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return token === env.AGENT_API_TOKEN;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ channel: string }> }) {
  if (!checkAuth(req)) return unauthorized();

  const { channel: raw } = await ctx.params;
  const parsed = channelSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "invalid_channel", allowed: ["prod", "dev"] }, { status: 400 });
  }

  try {
    const release = await fetchLatestRelease(parsed.data);
    if (!release) {
      return Response.json({ error: "no_release_found", channel: parsed.data }, { status: 404 });
    }
    return Response.json(release);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return Response.json({ error: "github_fetch_failed", message }, { status: 502 });
  }
}
