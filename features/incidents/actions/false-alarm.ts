"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getColumns, getIncidentById } from "../api";
import { markFalseAlarm, requireRole } from "../lib";
import { incidentToUpdateRow } from "../mappers";
import { type FalseAlarmInput, falseAlarmSchema } from "../schemas";
import { insertIncidentEvents, requireIncidentsPermission } from "./common";

export async function markFalseAlarmAction(input: FalseAlarmInput) {
  const session = await requireIncidentsPermission("incidents.manage");
  const parsed = falseAlarmSchema.parse(input);
  const [incident, columns] = await Promise.all([getIncidentById(parsed.incidentId), getColumns()]);
  if (!incident) throw new Error("Incident introuvable.");
  const from = columns.find((c) => c.id === incident.columnId);
  const rejectColumn = requireRole(columns, "rejete");
  if (!from) throw new Error("Colonne introuvable.");

  const {
    incident: next,
    events,
    ignore,
  } = markFalseAlarm(
    incident,
    from,
    rejectColumn,
    { ignoreSignal: parsed.ignoreSignal, reason: parsed.reason },
    session.id,
    new Date(),
  );

  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .update(incidentToUpdateRow(next))
    .eq("id", next.id);
  if (error) throw new Error(error.message);
  await insertIncidentEvents(next.id, events);

  if (ignore) {
    const { error: ignoreError } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table signal_ignores ajoutée par migration, types.ts à regénérer
      .from("signal_ignores" as any)
      .upsert(
        {
          signal_type: ignore.signalType,
          borne_id: ignore.borneId,
          created_by: session.id,
          reason: parsed.reason ?? null,
        },
        { onConflict: "signal_type,borne_id" },
      );
    if (ignoreError) throw new Error(ignoreError.message);
  }

  revalidatePath("/incidents");
}
