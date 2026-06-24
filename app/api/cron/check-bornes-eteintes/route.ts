import "server-only";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

// Cron quotidien (Vercel) : flag les bornes éteintes depuis >3j (et installées depuis >48h
// pour exclure les fresh installs). Gravité critique en base → déclenche le SMS via le
// trigger Postgres existant ; UI affiche orange (warning) — cf. icons.ts.
// Résolution auto via trigger Postgres sur heartbeats (cf. brief).

const querySchema = z.object({
  dry: z
    .union([z.literal("1"), z.literal("true")])
    .optional()
    .transform((v) => v !== undefined),
});

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = querySchema.safeParse({
    dry: req.nextUrl.searchParams.get("dry") ?? undefined,
  });
  if (!parsed.success) {
    return Response.json({ error: "bad params" }, { status: 400 });
  }
  const dry = parsed.data.dry;

  const supabase = createAdminClient();
  const now = Date.now();
  const lastSeenCutoff = new Date(now - THREE_DAYS_MS).toISOString();
  const firstSeenCutoff = new Date(now - FORTY_EIGHT_HOURS_MS).toISOString();

  const { data: bornes, error: bornesErr } = await supabase.from("bornes").select("id, nom_lieu");
  if (bornesErr) return Response.json({ error: bornesErr.message }, { status: 500 });

  const candidates = await Promise.all(
    (bornes ?? []).map(async (b) => {
      const [latest, earliest] = await Promise.all([
        supabase
          .from("heartbeats")
          .select("timestamp")
          .eq("borne_id", b.id)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("heartbeats")
          .select("timestamp")
          .eq("borne_id", b.id)
          .order("timestamp", { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);
      const last = latest.data?.timestamp;
      const first = earliest.data?.timestamp;
      if (!(last && first)) return null;
      if (last >= lastSeenCutoff) return null;
      if (first >= firstSeenCutoff) return null;
      return { borne_id: b.id, nom_lieu: b.nom_lieu, last_seen: last };
    }),
  );
  const matched = candidates.filter((c): c is NonNullable<typeof c> => c !== null);

  if (matched.length === 0) {
    return Response.json({ dry, matched: 0, inserted: 0, skipped: 0 });
  }

  const { data: existingAlerts } = await supabase
    .from("alertes")
    .select("borne_id")
    .eq("type", "borne_eteinte_3_jours")
    .eq("statut", "ouverte")
    .in(
      "borne_id",
      matched.map((m) => m.borne_id),
    );
  const alreadyOpen = new Set((existingAlerts ?? []).map((a) => a.borne_id));
  const toInsert = matched.filter((m) => !alreadyOpen.has(m.borne_id));

  if (dry || toInsert.length === 0) {
    return Response.json({
      dry,
      matched: matched.length,
      inserted: 0,
      skipped: matched.length - toInsert.length,
      preview: toInsert.map((m) => ({ borne_id: m.borne_id, nom_lieu: m.nom_lieu })),
    });
  }

  const nowIso = new Date(now).toISOString();
  const rows = toInsert.map((m) => ({
    borne_id: m.borne_id,
    type: "borne_eteinte_3_jours",
    source: "dashboard",
    message: `Borne ${m.nom_lieu} eteinte depuis 3 jours (dernier signe de vie : ${m.last_seen})`,
    gravite: "critique" as const,
    statut: "ouverte" as const,
    timestamp: nowIso,
  }));

  const { error: insertErr } = await supabase.from("alertes").insert(rows);
  if (insertErr) return Response.json({ error: insertErr.message }, { status: 500 });

  return Response.json({
    dry: false,
    matched: matched.length,
    inserted: rows.length,
    skipped: matched.length - rows.length,
  });
}
