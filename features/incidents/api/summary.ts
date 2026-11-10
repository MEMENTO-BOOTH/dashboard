import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** Nombre de P1 ouverts (colonne hors Clôture/Rejet). Sert à la pastille du menu. */
export async function getOpenP1Count(): Promise<number> {
  const supabase = createAdminClient();
  const [{ data: cols, error: colsError }, { data: incs, error: incsError }] = await Promise.all([
    supabase
      // biome-ignore lint/suspicious/noExplicitAny: table incident_columns ajoutée par migration, types.ts à regénérer
      .from("incident_columns" as any)
      .select("id, role"),
    supabase
      // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
      .from("incidents" as any)
      .select("column_id")
      .eq("priority", 1),
  ]);
  if (colsError) throw new Error(colsError.message);
  if (incsError) throw new Error(incsError.message);
  const finalIds = new Set(
    ((cols ?? []) as unknown as { id: string; role: string }[])
      .filter((c) => c.role === "cloture" || c.role === "rejete")
      .map((c) => c.id),
  );
  return ((incs ?? []) as unknown as { column_id: string }[]).filter(
    (i) => !finalIds.has(i.column_id),
  ).length;
}
