import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { refreshAccessToken, type TokenResponse } from "./oauth";

type TokenRow = {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope: string | null;
};

const TABLE = "google_tokens" as const;

// Supabase types ne connaissent pas encore `google_tokens` → cast léger.
type AnySupabase = {
  from: (table: string) => {
    select: (q: string) => {
      eq: (
        col: string,
        v: string,
      ) => {
        maybeSingle: () => Promise<{ data: TokenRow | null; error: { message: string } | null }>;
      };
    };
    upsert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    delete: () => {
      eq: (col: string, v: string) => Promise<{ error: { message: string } | null }>;
    };
  };
};

function expiresFromNow(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export async function getTokens(userId: string): Promise<TokenRow | null> {
  const sb = createAdminClient() as unknown as AnySupabase;
  const { data, error } = await sb.from(TABLE).select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function upsertTokens(
  userId: string,
  t: TokenResponse,
  prevRefresh?: string,
): Promise<void> {
  const sb = createAdminClient() as unknown as AnySupabase;
  const { error } = await sb.from(TABLE).upsert({
    user_id: userId,
    access_token: t.access_token,
    refresh_token: t.refresh_token ?? prevRefresh ?? "",
    expires_at: expiresFromNow(t.expires_in),
    scope: t.scope,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function deleteTokens(userId: string): Promise<void> {
  const sb = createAdminClient() as unknown as AnySupabase;
  const { error } = await sb.from(TABLE).delete().eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function getFreshAccessToken(userId: string): Promise<string | null> {
  const tokens = await getTokens(userId);
  if (!tokens) return null;
  if (new Date(tokens.expires_at).getTime() > Date.now() + 60_000) {
    return tokens.access_token;
  }
  const refreshed = await refreshAccessToken(tokens.refresh_token);
  await upsertTokens(userId, refreshed, tokens.refresh_token);
  return refreshed.access_token;
}
