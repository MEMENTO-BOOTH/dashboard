"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllIncidents, getColumns } from "../api";
import { planColumnChanges } from "../lib";
import { incidentToUpdateRow } from "../mappers";
import { type SaveColumnsInput, saveColumnsSchema } from "../schemas";
import { insertIncidentEvents, requireIncidentsPermission } from "./common";

export type SaveColumnsResult = { ok: true } | { ok: false; errors: string[] };

/** RG-16 : remplace entièrement l'ensemble des colonnes. */
export async function saveColumnsAction(input: SaveColumnsInput): Promise<SaveColumnsResult> {
  const session = await requireIncidentsPermission("incidents.settings");
  const parsed = saveColumnsSchema.parse(input);

  const [existing, incidents] = await Promise.all([getColumns(), getAllIncidents()]);
  const existingIds = new Set(existing.map((c) => c.id));

  const finalColumns = parsed.columns.map((c) => ({
    id: c.id ?? crypto.randomUUID(),
    name: c.name,
    role: c.role,
    observationDays: c.observationDays,
    position: c.position,
  }));

  const plan = planColumnChanges(incidents, finalColumns, parsed.moves, session.id, new Date());
  if (plan.errors.length > 0) return { ok: false, errors: plan.errors };

  const supabase = createAdminClient();

  for (const { incident, events } of plan.updates) {
    const { error } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
      .from("incidents" as any)
      .update(incidentToUpdateRow(incident))
      .eq("id", incident.id);
    if (error) throw new Error(error.message);
    await insertIncidentEvents(incident.id, events);
  }

  const finalIds = new Set(finalColumns.map((c) => c.id));
  const deletedIds = [...existingIds].filter((id) => !finalIds.has(id));
  if (deletedIds.length > 0) {
    const { error } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table incident_columns ajoutée par migration, types.ts à regénérer
      .from("incident_columns" as any)
      .delete()
      .in("id", deletedIds);
    if (error) throw new Error(error.message);
  }

  const { error: upsertError } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_columns ajoutée par migration, types.ts à regénérer
    .from("incident_columns" as any)
    .upsert(
      finalColumns.map((c) => ({
        id: c.id,
        name: c.name,
        role: c.role,
        observation_days: c.observationDays,
        position: c.position,
      })),
    );
  if (upsertError) throw new Error(upsertError.message);

  revalidatePath("/incidents");
  return { ok: true };
}
