"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { IncidentRow } from "@/lib/supabase/extensions";
import { getColumns } from "../api";
import { createManualIncident } from "../lib";
import { draftToInsertRow, rowToIncident } from "../mappers";
import { type CreateIncidentInput, createIncidentSchema } from "../schemas";
import { insertIncidentEvents, requireIncidentsPermission } from "./common";

export async function createIncidentAction(input: CreateIncidentInput) {
  const session = await requireIncidentsPermission("incidents.manage");
  const parsed = createIncidentSchema.parse(input);
  const columns = await getColumns();

  let assigneeName: string | undefined;
  if (parsed.assigneeId) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("utilisateurs")
      .select("nom")
      .eq("id", parsed.assigneeId)
      .maybeSingle();
    assigneeName = data?.nom;
  }

  const { incident: draft, events } = createManualIncident({
    title: parsed.title,
    borneId: parsed.borneId,
    source: parsed.source,
    priority: parsed.priority,
    origin: parsed.origin,
    assigneeId: parsed.assigneeId ?? null,
    description: parsed.description,
    actorId: session.id,
    assigneeName,
    columns,
    at: new Date(),
  });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
    .from("incidents" as any)
    .insert(draftToInsertRow(draft))
    .select("*")
    // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas incidents
    .single<any>();
  if (error) throw new Error(error.message);

  const incident = rowToIncident(data as IncidentRow);
  await insertIncidentEvents(incident.id, events);
  revalidatePath("/incidents");
  return incident;
}
