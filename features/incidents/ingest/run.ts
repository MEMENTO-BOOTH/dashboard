import "server-only";
import {
  getAllIncidents,
  getColumns,
  getIgnoredSignals,
  getSettings,
  getSignalRules,
} from "../api";
import { type Incident, incidentKey, ingestSignal } from "../lib";
import { applyIngestResult } from "./apply-result";
import { reconcileClearedSignals } from "./clear";
import {
  advanceIngestCursor,
  getIngestCursor,
  getNewAlertRows,
  upsertSignalState,
} from "./queries";

function groupByKey(incidents: readonly Incident[]): Map<string, Incident[]> {
  const byKey = new Map<string, Incident[]>();
  for (const incident of incidents) {
    if (!incident.signalType) continue;
    const key = incidentKey(incident.signalType, incident.borneId);
    const arr = byKey.get(key) ?? [];
    arr.push(incident);
    byKey.set(key, arr);
  }
  return byKey;
}

export type IngestCycleResult = { processed: number; skippedUnknownType: number; cleared: number };

/**
 * Traduit les nouvelles lignes de `alertes` en incidents (section 6 du cahier des
 * charges). Conçu pour tourner en un seul cron séquentiel (pas de verrou distribué :
 * un seul exécuteur à la fois, voir vercel.json).
 */
export async function runIncidentsIngestCycle(now: Date = new Date()): Promise<IngestCycleResult> {
  const [cursor, rules, ignored, columns, incidents] = await Promise.all([
    getIngestCursor(),
    getSignalRules(),
    getIgnoredSignals(),
    getColumns(),
    getAllIncidents(),
  ]);
  const settings = await getSettings();
  const rulesByType = new Map(rules.map((r) => [r.signalType, r]));
  const incidentsByKey = groupByKey(incidents);
  const newRows = await getNewAlertRows(cursor);

  let processed = 0;
  let skippedUnknownType = 0;

  for (const row of newRows) {
    const rule = rulesByType.get(row.type);
    if (!rule) {
      skippedUnknownType += 1;
      continue;
    }
    const key = incidentKey(row.type, row.borne_id);
    const result = ingestSignal({
      signalType: row.type,
      borneId: row.borne_id,
      at: new Date(row.created_at),
      rule,
      columns,
      sameKeyIncidents: incidentsByKey.get(key) ?? [],
      isIgnored: ignored.has(key),
      settings,
    });
    const persisted = await applyIngestResult(result);
    if (persisted) {
      const arr = incidentsByKey.get(key) ?? [];
      const idx = arr.findIndex((i) => i.id === persisted.id);
      if (idx >= 0) arr[idx] = persisted;
      else arr.push(persisted);
      incidentsByKey.set(key, arr);
    }
    if (rule.kind === "etat") await upsertSignalState(row.type, row.borne_id, true);
    processed += 1;
  }

  const cleared = await reconcileClearedSignals(incidentsByKey, columns);
  await advanceIngestCursor(now);
  return { processed, skippedUnknownType, cleared };
}
