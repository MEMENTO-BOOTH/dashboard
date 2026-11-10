import { indexColumns, isOpen, observationDaysOf } from "./columns";
import { daysBetween } from "./format";
import { type Column, DEFAULT_SETTINGS, type Incident, type Settings } from "./types";

/** Priorité d'abord (P1 en haut), puis le plus ancien en haut. RG-09. */
export function compareIncidents(a: Incident, b: Incident): number {
  return a.priority - b.priority || a.createdAt.getTime() - b.createdAt.getTime();
}

/** RG-12 */
export function isRecurrent(incident: Incident, settings: Settings = DEFAULT_SETTINGS): boolean {
  return incident.returned || incident.episodes >= settings.recurrenceThreshold;
}

/** RG-13 : nombre de bornes concernées si l'incident fait partie d'une série, sinon 0. */
export function seriesSize(
  incident: Incident,
  all: readonly Incident[],
  columnsById: ReadonlyMap<string, Column>,
): number {
  if (!(incident.signalType && isOpen(incident, columnsById))) return 0;
  const bornes = new Set(
    all
      .filter((i) => i.signalType === incident.signalType && isOpen(i, columnsById))
      .map((i) => i.borneId),
  );
  return bornes.size >= 2 ? bornes.size : 0;
}

/** RG-10 */
export function isStale(
  incident: Incident,
  column: Column,
  now: Date,
  settings: Settings = DEFAULT_SETTINGS,
): boolean {
  return column.role === "libre" && daysBetween(incident.movedAt, now) > settings.stagnationDays;
}

/** RG-11 */
export function isArchived(
  incident: Incident,
  column: Column,
  now: Date,
  settings: Settings = DEFAULT_SETTINGS,
): boolean {
  if (column.role !== "cloture") return false;
  const closed = incident.closedAt ?? incident.movedAt;
  return daysBetween(closed, now) > settings.archiveDays;
}

export type ObservationStatus =
  | { state: "none" }
  | { state: "running"; daysLeft: number; progress: number }
  | { state: "ready"; days: number };

/** RG-08 : bandeau de la colonne Observation. progress va de 0 à 1. */
export function observationStatus(
  incident: Incident,
  column: Column,
  now: Date,
): ObservationStatus {
  if (column.role !== "observation" || !incident.obsStartedAt) return { state: "none" };
  const days = observationDaysOf(column);
  const elapsed = daysBetween(incident.obsStartedAt, now);
  if (elapsed >= days) return { state: "ready", days };
  return {
    state: "running",
    daysLeft: Math.max(1, Math.ceil(days - elapsed)),
    progress: Math.max(0, elapsed / days),
  };
}

export interface Summary {
  openCount: number;
  p1Open: number;
  bornesDown: number;
  unassigned: number;
  readyToClose: number;
}

/** Chiffres clés de l'en-tête. La pastille du menu = p1Open. */
export function summarize(
  incidents: readonly Incident[],
  columns: readonly Column[],
  now: Date,
): Summary {
  const byId = indexColumns(columns);
  const open = incidents.filter((i) => isOpen(i, byId));
  return {
    openCount: open.length,
    p1Open: open.filter((i) => i.priority === 1).length,
    bornesDown: new Set(open.filter((i) => i.downSince).map((i) => i.borneId)).size,
    unassigned: open.filter((i) => !i.assigneeId).length,
    readyToClose: incidents.filter((i) => {
      const column = byId.get(i.columnId);
      return column !== undefined && observationStatus(i, column, now).state === "ready";
    }).length,
  };
}
