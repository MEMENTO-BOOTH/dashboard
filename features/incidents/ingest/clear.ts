import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { insertIncidentEvents } from "../actions/common";
import { type Column, type Incident, incidentKey, isOpen, signalCleared } from "../lib";
import { incidentToUpdateRow } from "../mappers";
import { getActiveSignalStates, getOpenAlertKeys, upsertSignalState } from "./queries";

/**
 * RG-19 : un signal d'état dont plus aucune alerte n'est ouverte est revenu à la
 * normale. Referme (côté signal, pas la carte) l'incident ouvert correspondant.
 */
export async function reconcileClearedSignals(
  incidentsByKey: Map<string, Incident[]>,
  columns: readonly Column[],
): Promise<number> {
  const [activeStates, openAlertKeys] = await Promise.all([
    getActiveSignalStates(),
    getOpenAlertKeys(),
  ]);
  const columnsById = new Map(columns.map((c) => [c.id, c]));
  const supabase = createAdminClient();
  let cleared = 0;

  for (const state of activeStates) {
    const key = incidentKey(state.signal_type, state.borne_id);
    if (openAlertKeys.has(key)) continue;

    const openIncident = (incidentsByKey.get(key) ?? []).find((i) => isOpen(i, columnsById));
    if (openIncident) {
      const { incident: next, events } = signalCleared(openIncident, new Date());
      const { error } = await supabase
        // biome-ignore lint/suspicious/noExplicitAny: table incidents ajoutée par migration, types.ts à regénérer
        .from("incidents" as any)
        .update(incidentToUpdateRow(next))
        .eq("id", next.id);
      if (error) throw new Error(error.message);
      await insertIncidentEvents(next.id, events);
      cleared += 1;
    }
    await upsertSignalState(state.signal_type, state.borne_id, false);
  }
  return cleared;
}
