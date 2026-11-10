"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  type SaveSettingsInput,
  type SaveSignalRuleInput,
  saveSettingsSchema,
  saveSignalRuleSchema,
} from "../schemas";
import { requireIncidentsPermission } from "./common";

export async function saveSettingsAction(input: SaveSettingsInput) {
  await requireIncidentsPermission("incidents.settings");
  const parsed = saveSettingsSchema.parse(input);
  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_settings ajoutée par migration, types.ts à regénérer
    .from("incident_settings" as any)
    .update({
      stagnation_days: parsed.stagnationDays,
      archive_days: parsed.archiveDays,
      recurrence_threshold: parsed.recurrenceThreshold,
      recidive_window_days: parsed.recidiveWindowDays,
    })
    .eq("id", true);
  if (error) throw new Error(error.message);
  revalidatePath("/incidents");
}

export async function saveSignalRuleAction(input: SaveSignalRuleInput) {
  await requireIncidentsPermission("incidents.settings");
  const parsed = saveSignalRuleSchema.parse(input);
  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table signal_rules ajoutée par migration, types.ts à regénérer
    .from("signal_rules" as any)
    .update({
      label: parsed.label,
      default_priority: parsed.defaultPriority,
      default_origin: parsed.defaultOrigin,
      takes_borne_down: parsed.takesBorneDown,
    })
    .eq("signal_type", parsed.signalType);
  if (error) throw new Error(error.message);
  revalidatePath("/incidents");
}

export async function removeIgnoredSignalAction(signalType: string, borneId: string) {
  await requireIncidentsPermission("incidents.settings");
  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table signal_ignores ajoutée par migration, types.ts à regénérer
    .from("signal_ignores" as any)
    .delete()
    .eq("signal_type", signalType)
    .eq("borne_id", borneId);
  if (error) throw new Error(error.message);
  revalidatePath("/incidents");
}
