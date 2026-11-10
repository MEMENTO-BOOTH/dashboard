"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getColumns, getIncidentById } from "../api";
import { applyMove, MoveRefusedError, requireRole } from "../lib";
import { incidentToUpdateRow } from "../mappers";
import { type MoveIncidentInput, moveIncidentSchema, type ReopenIncidentInput } from "../schemas";
import { insertIncidentEvents, requireIncidentsPermission } from "./common";

export type MoveActionResult =
  | { ok: true }
  | { ok: false; need: "assignee" | "origin" }
  | { ok: false; error: string };

export async function moveIncidentAction(input: MoveIncidentInput): Promise<MoveActionResult> {
  const session = await requireIncidentsPermission("incidents.manage");
  const parsed = moveIncidentSchema.parse(input);
  const [incident, columns] = await Promise.all([getIncidentById(parsed.incidentId), getColumns()]);
  if (!incident) {
    return {
      ok: false,
      error: "Cet incident n'existe plus (borne supprimée ?). Le tableau va se rafraîchir.",
    };
  }
  const from = columns.find((c) => c.id === incident.columnId);
  const to = columns.find((c) => c.id === parsed.toColumnId);
  if (!(from && to))
    return { ok: false, error: "Colonne introuvable. Le tableau va se rafraîchir." };

  try {
    const { incident: next, events } = applyMove(incident, from, to, session.id, new Date());
    const supabase = createAdminClient();
    const { error } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
      .from("incidents" as any)
      .update(incidentToUpdateRow(next))
      .eq("id", next.id);
    if (error) throw new Error(error.message);
    await insertIncidentEvents(next.id, events);
    revalidatePath("/incidents");
    return { ok: true };
  } catch (err) {
    if (err instanceof MoveRefusedError) return { ok: false, need: err.need };
    throw err;
  }
}

/** RG-17 : réouverture depuis Clôture ou Rejet, vers la colonne Entrée. */
export async function reopenIncidentAction(input: ReopenIncidentInput) {
  const session = await requireIncidentsPermission("incidents.manage");
  const [incident, columns] = await Promise.all([getIncidentById(input.incidentId), getColumns()]);
  if (!incident) throw new Error("Incident introuvable.");
  const from = columns.find((c) => c.id === incident.columnId);
  const entree = requireRole(columns, "entree");
  if (!from) throw new Error("Colonne introuvable.");

  const { incident: next, events } = applyMove(incident, from, entree, session.id, new Date());
  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .update(incidentToUpdateRow(next))
    .eq("id", next.id);
  if (error) throw new Error(error.message);
  await insertIncidentEvents(next.id, [
    ...events,
    { kind: "event", authorId: session.id, body: "Incident rouvert." },
  ]);
  revalidatePath("/incidents");
}
