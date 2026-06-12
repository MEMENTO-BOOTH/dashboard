import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Activity, buildActivity } from "./lib/activity";
import { parisDayRangeIso } from "./lib/day-range";
import type { RawAlerte, RawPrinterLog } from "./lib/printer";

const FEUILLES_MAX_DEFAULT = 400;

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

export async function getBorneAlertes(borneId: string, date: string): Promise<RawAlerte[]> {
  const supabase = createAdminClient();
  const { startIso, endIso } = parisDayRangeIso(date);

  const res = await supabase
    .from("alertes")
    .select("timestamp, type, message, gravite, statut")
    .eq("borne_id", borneId)
    .gte("timestamp", startIso)
    .lte("timestamp", endIso);

  if (res.error) throw res.error;

  return (res.data ?? []).map((a) => ({
    timestamp: a.timestamp,
    type: a.type,
    message: a.message,
    gravite: a.gravite,
    statut: a.statut,
  }));
}

export async function getBornePrinterLog(borneId: string, date: string): Promise<RawPrinterLog[]> {
  const supabase = createAdminClient();
  const { startIso, endIso } = parisDayRangeIso(date);

  const res = await supabase
    .from("printer_events")
    .select("timestamp, feuilles_restantes, photos_sorties, imprimante_statut")
    .eq("borne_id", borneId)
    .gte("timestamp", startIso)
    .lte("timestamp", endIso)
    .order("timestamp", { ascending: false });

  if (res.error) throw res.error;

  return (res.data ?? []).map((e) => ({
    timestamp: e.timestamp,
    feuilles_restantes: e.feuilles_restantes,
    photos_sorties: Number(e.photos_sorties ?? 0),
    imprimante_statut: String(e.imprimante_statut ?? ""),
  }));
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
