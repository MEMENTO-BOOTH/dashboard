import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SignalStateRow } from "@/lib/supabase/extensions";

export type NewAlertRow = { borne_id: string; type: string; created_at: string };

export async function getIngestCursor(): Promise<Date> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_settings ajoutée par migration, types.ts à regénérer
    .from("incident_settings" as any)
    .select("last_ingested_at")
    // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas incident_settings
    .single<any>();
  if (error) throw new Error(error.message);
  return new Date(data.last_ingested_at);
}

export async function advanceIngestCursor(at: Date): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_settings ajoutée par migration, types.ts à regénérer
    .from("incident_settings" as any)
    .update({ last_ingested_at: at.toISOString() })
    .eq("id", true);
  if (error) throw new Error(error.message);
}

/** Alertes créées après le curseur, triées du plus ancien au plus récent. */
export async function getNewAlertRows(since: Date): Promise<NewAlertRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("alertes")
    .select("borne_id, type, created_at")
    .gt("created_at", since.toISOString())
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Alertes encore ouvertes/assignées, quel que soit leur âge (rattrapage des cartes manquantes). */
export async function getOpenAlertRows(): Promise<NewAlertRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("alertes")
    .select("borne_id, type, created_at")
    .in("statut", ["ouverte", "assignee"])
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Clés `type|borne_id` ayant au moins une alerte ouverte/assignée actuellement. */
export async function getOpenAlertKeys(): Promise<Set<string>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("alertes")
    .select("borne_id, type")
    .in("statut", ["ouverte", "assignee"]);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r) => `${r.type}|${r.borne_id}`));
}

export async function getActiveSignalStates(): Promise<SignalStateRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table signal_states ajoutée par migration, types.ts à regénérer
    .from("signal_states" as any)
    .select("*")
    .eq("active", true);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SignalStateRow[];
}

export async function upsertSignalState(
  signalType: string,
  borneId: string,
  active: boolean,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table signal_states ajoutée par migration, types.ts à regénérer
    .from("signal_states" as any)
    .upsert(
      { signal_type: signalType, borne_id: borneId, active, changed_at: new Date().toISOString() },
      { onConflict: "signal_type,borne_id" },
    );
  if (error) throw new Error(error.message);
}
