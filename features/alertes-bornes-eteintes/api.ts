import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Détecte les bornes éteintes depuis >3j (et installées depuis >48h pour exclure les
// fresh installs) puis ouvre une alerte type=borne_eteinte_3_jours. Anti-spam : skip
// si une alerte du même type est déjà ouverte pour la borne. Gravité critique en base
// (déclenche SMS via trigger Postgres). Résolution auto via trigger Postgres on heartbeats.

export const ALERT_TYPE = "borne_eteinte_3_jours" as const;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

const parisDateFmt = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatLastSeen(iso: string): string {
  const parts = parisDateFmt.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}/${get("month")} à ${get("hour")}h${get("minute")}`;
}

export type BorneCandidate = {
  borne_id: string;
  nom_lieu: string;
  last_seen: string;
};

export type CronResult = {
  dry: boolean;
  matched: number;
  inserted: number;
  skipped: number;
  preview?: { borne_id: string; nom_lieu: string }[];
};

export async function detectBornesEteintes(now: Date = new Date()): Promise<BorneCandidate[]> {
  const supabase = createAdminClient();
  const lastSeenCutoff = new Date(now.getTime() - THREE_DAYS_MS).toISOString();
  const firstSeenCutoff = new Date(now.getTime() - FORTY_EIGHT_HOURS_MS).toISOString();

  const { data: bornes, error } = await supabase
    .from("bornes")
    .select("id, nom_lieu")
    .eq("statut", "active");
  if (error) throw new Error(error.message);

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
  return candidates.filter((c): c is BorneCandidate => c !== null);
}

export async function runCron(dry: boolean, now: Date = new Date()): Promise<CronResult> {
  const supabase = createAdminClient();
  const matched = await detectBornesEteintes(now);

  if (matched.length === 0) {
    return { dry, matched: 0, inserted: 0, skipped: 0 };
  }

  const { data: existing } = await supabase
    .from("alertes")
    .select("borne_id")
    .eq("type", ALERT_TYPE)
    .eq("statut", "ouverte")
    .in(
      "borne_id",
      matched.map((m) => m.borne_id),
    );
  const alreadyOpen = new Set((existing ?? []).map((a) => a.borne_id));
  const toInsert = matched.filter((m) => !alreadyOpen.has(m.borne_id));

  if (dry || toInsert.length === 0) {
    return {
      dry,
      matched: matched.length,
      inserted: 0,
      skipped: matched.length - toInsert.length,
      preview: toInsert.map((m) => ({ borne_id: m.borne_id, nom_lieu: m.nom_lieu })),
    };
  }

  const nowIso = now.toISOString();
  const rows = toInsert.map((m) => ({
    borne_id: m.borne_id,
    type: ALERT_TYPE,
    source: "dashboard",
    message: `🔌 Borne ${m.nom_lieu} éteinte depuis 3 jours (dernier signe de vie : ${formatLastSeen(m.last_seen)}).`,
    gravite: "critique" as const,
    statut: "ouverte" as const,
    timestamp: nowIso,
  }));

  const { error: insertErr } = await supabase.from("alertes").insert(rows);
  if (insertErr) throw new Error(insertErr.message);

  return {
    dry: false,
    matched: matched.length,
    inserted: rows.length,
    skipped: matched.length - rows.length,
  };
}
