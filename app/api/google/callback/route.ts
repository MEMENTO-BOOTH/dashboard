import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { exchangeCode } from "@/features/google-calendar/oauth";
import { upsertTokens } from "@/features/google-calendar/tokens";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code || !state) {
    redirect(`/utilisateurs?google=error`);
  }
  if (!(code && state)) return new Response("missing params", { status: 400 });

  const tokens = await exchangeCode(code);
  await upsertTokens(state, tokens);

  redirect(`/utilisateurs/${state}?google=connected`);
}
