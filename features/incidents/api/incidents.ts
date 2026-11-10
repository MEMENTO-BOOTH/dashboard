import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { IncidentEventRow, IncidentRow } from "@/lib/supabase/extensions";
import type { Incident } from "../lib";
import { incidentEventRowToNote, rowToIncident } from "../mappers";

export async function getAllIncidents(): Promise<Incident[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as IncidentRow[]).map(rowToIncident);
}

/** Nombre de notes (hors événements automatiques) par incident, pour le pied de carte. */
export async function getNoteCounts(): Promise<Map<string, number>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_events ajoutée par migration, types.ts à regénérer
    .from("incident_events" as any)
    .select("incident_id")
    .eq("kind", "note");
  if (error) throw new Error(error.message);
  const counts = new Map<string, number>();
  for (const row of (data ?? []) as unknown as { incident_id: string }[]) {
    counts.set(row.incident_id, (counts.get(row.incident_id) ?? 0) + 1);
  }
  return counts;
}

export async function getIncidentEvents(incidentId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_events ajoutée par migration, types.ts à regénérer
    .from("incident_events" as any)
    .select("*")
    .eq("incident_id", incidentId)
    .order("created_at");
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as IncidentEventRow[]).map(incidentEventRowToNote);
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .select("*")
    .eq("id", id)
    // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas incidents
    .maybeSingle<any>();
  if (error) throw new Error(error.message);
  return data ? rowToIncident(data as IncidentRow) : null;
}

/** Autres incidents de la même borne dans les 30 derniers jours (fiche détail). */
export async function getRelatedIncidents(
  borneId: string,
  excludeId: string,
  sinceDays = 30,
): Promise<Incident[]> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .select("*")
    .eq("borne_id", borneId)
    .neq("id", excludeId)
    .gte("created_at", since)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as IncidentRow[]).map(rowToIncident);
}
