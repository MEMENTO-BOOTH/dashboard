import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { barEventSchema, type EvenementView, licencesEventSchema } from "./schemas";

function toType(kind: string | null): "bar" | "event" {
  return kind === "event" ? "event" : "bar";
}

async function getBarEvents(): Promise<EvenementView[]> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from("kapsule_events")
    .select("id, name, kind, deleted, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const rows: EvenementView[] = [];
  for (const row of data ?? []) {
    const parsed = barEventSchema.safeParse(row);
    if (parsed.success && parsed.data.deleted !== true) {
      rows.push({
        id: parsed.data.id,
        name: parsed.data.name,
        type: toType(parsed.data.kind),
        source: "bar",
        client: null,
        createdAt: parsed.data.created_at,
      });
    }
  }
  return rows;
}

async function getClientEvents(): Promise<EvenementView[]> {
  const token = env.KAPSULE_LICENCES_ADMIN_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(`${env.KAPSULE_LICENCES_URL}/api/v1/events`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { events?: unknown };
    const list = Array.isArray(body.events) ? body.events : [];
    const rows: EvenementView[] = [];
    for (const row of list) {
      const parsed = licencesEventSchema.safeParse(row);
      if (parsed.success) {
        rows.push({
          id: parsed.data.id,
          name: parsed.data.name,
          type: toType(parsed.data.kind),
          source: "client",
          client: parsed.data.tenantName,
          createdAt: parsed.data.createdAt,
        });
      }
    }
    return rows;
  } catch {
    return [];
  }
}

export async function getEvenements(): Promise<EvenementView[]> {
  const [bar, client] = await Promise.all([getBarEvents(), getClientEvents()]);
  return [...bar, ...client].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
