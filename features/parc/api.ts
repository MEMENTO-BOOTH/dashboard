import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Activity, buildActivity } from "./lib/activity";

const FEUILLES_MAX_DEFAULT = 400;
const PARIS_TZ = "Europe/Paris";

function parisOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  return asUtc - date.getTime();
}

function parisDayRangeIso(ymd: string): { startIso: string; endIso: string } {
  const parts = ymd.split("-").map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const offset = parisOffsetMs(new Date(Date.UTC(y, m - 1, d, 12)));
  const startMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0) - offset;
  const endMs = Date.UTC(y, m - 1, d, 23, 59, 59, 999) - offset;
  return { startIso: new Date(startMs).toISOString(), endIso: new Date(endMs).toISOString() };
}

export async function getBorneActivity(borneId: string, date: string): Promise<Activity> {
  const supabase = createAdminClient();
  const { startIso, endIso } = parisDayRangeIso(date);

  const txRes = await supabase
    .from("transactions")
    .select("paiement_at, montant, feuilles_avant, feuilles_apres")
    .eq("borne_id", borneId)
    .gte("paiement_at", startIso)
    .lte("paiement_at", endIso)
    .order("paiement_at", { ascending: true });

  if (txRes.error) throw txRes.error;

  return buildActivity(
    (txRes.data ?? []).map((t) => ({
      paiement_at: t.paiement_at,
      montant: Number(t.montant),
      feuilles_avant: t.feuilles_avant,
      feuilles_apres: t.feuilles_apres,
    })),
    FEUILLES_MAX_DEFAULT,
    startIso,
    endIso,
  );
}

export type Intervention = {
  id: string;
  borne_id: string;
  borne_nom: string;
  type: string;
  description: string | null;
  date: string;
  duree_minutes: number | null;
  intervenant_nom: string | null;
};

export async function getInterventionsByBorne(borneId: string): Promise<Intervention[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interventions")
    .select("*, bornes(nom_lieu), utilisateurs(nom)")
    .eq("borne_id", borneId)
    .order("date", { ascending: false })
    .limit(10);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    borne_id: row.borne_id,
    borne_nom: row.bornes?.nom_lieu ?? "—",
    type: row.type,
    description: row.description,
    date: row.date,
    duree_minutes: row.duree_minutes,
    intervenant_nom: row.utilisateurs?.nom ?? "—",
  }));
}

export async function getInterventions(): Promise<Intervention[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interventions")
    .select("*, bornes(nom_lieu), utilisateurs(nom)")
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    borne_id: row.borne_id,
    borne_nom: row.bornes?.nom_lieu ?? "—",
    type: row.type,
    description: row.description,
    date: row.date,
    duree_minutes: row.duree_minutes,
    intervenant_nom: row.utilisateurs?.nom ?? "—",
  }));
}
