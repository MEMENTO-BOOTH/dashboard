import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { buildAuthUrl } from "@/features/google-calendar/oauth";

// Démarre le flow OAuth Google pour un user donné.
// Usage: <a href="/api/google/connect?user_id=...">Connecter Google Calendar</a>

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return new Response("user_id required", { status: 400 });
  const url = buildAuthUrl(userId);
  redirect(url);
}
