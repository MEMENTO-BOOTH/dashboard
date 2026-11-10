import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  IncidentColumnRow,
  IncidentSettingsRow,
  SignalIgnoreRow,
  SignalRuleRow,
} from "@/lib/supabase/extensions";
import type { Column, Settings, SignalRule } from "../lib";
import { rowToColumn, rowToSettings, rowToSignalRule } from "../mappers";

export async function getColumns(): Promise<Column[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_columns ajoutée par migration, types.ts à regénérer
    .from("incident_columns" as any)
    .select("*")
    .order("position");
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as IncidentColumnRow[]).map(rowToColumn);
}

export async function getSignalRules(): Promise<SignalRule[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table signal_rules ajoutée par migration, types.ts à regénérer
    .from("signal_rules" as any)
    .select("*")
    .order("label");
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as SignalRuleRow[]).map(rowToSignalRule);
}

export async function getSettings(): Promise<Settings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_settings ajoutée par migration, types.ts à regénérer
    .from("incident_settings" as any)
    .select("*")
    // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas incident_settings
    .maybeSingle<any>();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("incident_settings : ligne de réglages manquante.");
  return rowToSettings(data as IncidentSettingsRow);
}

export async function getIgnoredSignals(): Promise<Set<string>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table signal_ignores ajoutée par migration, types.ts à regénérer
    .from("signal_ignores" as any)
    .select("signal_type, borne_id");
  if (error) throw new Error(error.message);
  return new Set(
    ((data ?? []) as unknown as Pick<SignalIgnoreRow, "signal_type" | "borne_id">[]).map(
      (r) => `${r.signal_type}|${r.borne_id}`,
    ),
  );
}
