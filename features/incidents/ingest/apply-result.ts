import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { IncidentRow } from "@/lib/supabase/extensions";
import { insertIncidentEvents } from "../actions/common";
import type { Incident, IngestResult } from "../lib";
import { draftToInsertRow, incidentToUpdateRow, rowToIncident } from "../mappers";

/**
 * Persiste le résultat de ingestSignal (voir ../lib/ingest.ts) et renvoie l'incident
 * final (avec son id), pour que l'appelant puisse mettre à jour son index en mémoire
 * et faire fusionner correctement les occurrences suivantes du même lot.
 */
export async function applyIngestResult(result: IngestResult): Promise<Incident | null> {
  if (result.action === "ignored") return null;

  const supabase = createAdminClient();
  if (result.action === "created") {
    const { data, error } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
      .from("incidents" as any)
      .insert(draftToInsertRow(result.incident))
      .select("*")
      // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas incidents
      .single<any>();
    if (error) throw new Error(error.message);
    const incident = rowToIncident(data as IncidentRow);
    await insertIncidentEvents(incident.id, result.events);
    return incident;
  }

  // merged | reopened
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .update(incidentToUpdateRow(result.incident))
    .eq("id", result.incident.id);
  if (error) throw new Error(error.message);
  await insertIncidentEvents(result.incident.id, result.events);
  return result.incident;
}
