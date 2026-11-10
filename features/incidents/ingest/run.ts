import "server-only";
import {
  getAllIncidents,
  getColumns,
  getIgnoredSignals,
  getSettings,
  getSignalRules,
} from "../api";
import {
  type Column,
  type Incident,
  incidentKey,
  indexColumns,
  ingestSignal,
  isOpen,
  type Settings,
  type SignalRule,
} from "../lib";
import { applyIngestResult } from "./apply-result";
import { reconcileClearedSignals } from "./clear";
import {
  advanceIngestCursor,
  getIngestCursor,
  getNewAlertRows,
  getOpenAlertRows,
  type NewAlertRow,
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

type Context = {
  rulesByType: Map<string, SignalRule>;
  ignored: Set<string>;
  columns: Column[];
  settings: Settings;
  incidentsByKey: Map<string, Incident[]>;
};

/** Passe une ligne d'alerte dans ingestSignal et persiste. Renvoie false si le type est inconnu. */
async function ingestRow(row: NewAlertRow, ctx: Context): Promise<boolean> {
  const rule = ctx.rulesByType.get(row.type);
  if (!rule) return false;
  const key = incidentKey(row.type, row.borne_id);
  const result = ingestSignal({
    signalType: row.type,
    borneId: row.borne_id,
    at: new Date(row.created_at),
    rule,
    columns: ctx.columns,
    sameKeyIncidents: ctx.incidentsByKey.get(key) ?? [],
    isIgnored: ctx.ignored.has(key),
    settings: ctx.settings,
  });
  const persisted = await applyIngestResult(result);
  if (persisted) {
    const arr = ctx.incidentsByKey.get(key) ?? [];
    const idx = arr.findIndex((i) => i.id === persisted.id);
    if (idx >= 0) arr[idx] = persisted;
    else arr.push(persisted);
    ctx.incidentsByKey.set(key, arr);
  }
  if (rule.kind === "etat") await upsertSignalState(row.type, row.borne_id, true);
  return true;
}

export type IngestCycleResult = {
  processed: number;
  backfilled: number;
  skippedUnknownType: number;
  cleared: number;
};

/**
 * Traduit les lignes de `alertes` en incidents (section 6 du cahier des charges) :
 * 1. les alertes créées depuis le curseur ;
 * 2. rattrapage : toute alerte encore ouverte dont le couple (type + borne) n'a
 *    aucune carte ouverte (alertes antérieures à l'activation, ou carte perdue).
 * Conçu pour tourner en un seul cron séquentiel (pas de verrou distribué).
 */
export async function runIncidentsIngestCycle(now: Date = new Date()): Promise<IngestCycleResult> {
  const [cursor, rules, ignored, columns, incidents, settings] = await Promise.all([
    getIngestCursor(),
    getSignalRules(),
    getIgnoredSignals(),
    getColumns(),
    getAllIncidents(),
    getSettings(),
  ]);
  const ctx: Context = {
    rulesByType: new Map(rules.map((r) => [r.signalType, r])),
    ignored,
    columns,
    settings,
    incidentsByKey: groupByKey(incidents),
  };
  const columnsById = indexColumns(columns);
  const hasOpenIncident = (key: string) =>
    (ctx.incidentsByKey.get(key) ?? []).some((i) => isOpen(i, columnsById));

  const result: IngestCycleResult = {
    processed: 0,
    backfilled: 0,
    skippedUnknownType: 0,
    cleared: 0,
  };

  for (const row of await getNewAlertRows(cursor)) {
    if (await ingestRow(row, ctx)) result.processed += 1;
    else result.skippedUnknownType += 1;
  }

  const seen = new Set<string>();
  for (const row of await getOpenAlertRows()) {
    const key = incidentKey(row.type, row.borne_id);
    if (seen.has(key) || hasOpenIncident(key)) continue;
    seen.add(key);
    if (await ingestRow(row, ctx)) result.backfilled += 1;
  }

  result.cleared = await reconcileClearedSignals(ctx.incidentsByKey, columns);
  await advanceIngestCursor(now);
  return result;
}
