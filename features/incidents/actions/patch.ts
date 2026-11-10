"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getIncidentById } from "../api";
import { applyPatch } from "../lib";
import { incidentToUpdateRow } from "../mappers";
import {
  type AddNoteInput,
  addNoteSchema,
  type PatchIncidentInput,
  patchIncidentSchema,
} from "../schemas";
import { insertIncidentEvents, requireIncidentsPermission, userNameResolver } from "./common";

export async function patchIncidentAction(input: PatchIncidentInput) {
  const session = await requireIncidentsPermission("incidents.manage");
  const parsed = patchIncidentSchema.parse(input);
  const incident = await getIncidentById(parsed.incidentId);
  if (!incident) throw new Error("Incident introuvable.");

  const userName = await userNameResolver();
  const { incident: next, events } = applyPatch(
    incident,
    {
      title: parsed.title,
      description: parsed.description,
      priority: parsed.priority,
      assigneeId: parsed.assigneeId,
      origin: parsed.origin,
      intervention: parsed.intervention,
      solution: parsed.solution,
      plannedAt: parsed.plannedAt,
    },
    session.id,
    userName,
  );

  if (events.length === 0) return next;

  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .update(incidentToUpdateRow(next))
    .eq("id", next.id);
  if (error) throw new Error(error.message);
  await insertIncidentEvents(next.id, events);
  revalidatePath("/incidents");
  return next;
}

export async function addNoteAction(input: AddNoteInput) {
  const session = await requireIncidentsPermission("incidents.manage");
  const parsed = addNoteSchema.parse(input);
  const incident = await getIncidentById(parsed.incidentId);
  if (!incident) throw new Error("Incident introuvable.");
  await insertIncidentEvents(incident.id, [
    { kind: "note", authorId: session.id, body: parsed.body },
  ]);
  revalidatePath("/incidents");
}
