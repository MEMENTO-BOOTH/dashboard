// Conversion entre les lignes Supabase (snake_case, dates en ISO string) et les
// types métier de lib/* (camelCase, Date). Garde toute la logique dans lib/
// indépendante du format de stockage, comme demandé par incidents-rules.ts.
import "server-only";
import type {
  IncidentColumnRow,
  IncidentEventRow,
  IncidentRow,
  IncidentSettingsRow,
  SignalRuleRow,
} from "@/lib/supabase/extensions";
import type { Column, Incident, IncidentDraft, Priority, SignalRule } from "./lib";

export function rowToColumn(row: IncidentColumnRow): Column {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    observationDays: row.observation_days,
    position: row.position,
  };
}

export function rowToSignalRule(row: SignalRuleRow): SignalRule {
  return {
    signalType: row.signal_type,
    label: row.label,
    defaultPriority: row.default_priority as Priority,
    defaultOrigin: row.default_origin,
    takesBorneDown: row.takes_borne_down,
    kind: row.kind,
  };
}

export function rowToIncident(row: IncidentRow): Incident {
  return {
    id: row.id,
    number: row.number,
    title: row.title,
    description: row.description,
    borneId: row.borne_id,
    signalType: row.signal_type,
    source: row.source,
    priority: row.priority as Priority,
    origin: row.origin,
    intervention: row.intervention,
    solution: row.solution,
    assigneeId: row.assignee_id,
    columnId: row.column_id,
    occurrences: row.occurrences,
    episodes: row.episodes,
    returned: row.returned,
    downSince: row.down_since ? new Date(row.down_since) : null,
    plannedAt: row.planned_at,
    obsStartedAt: row.obs_started_at ? new Date(row.obs_started_at) : null,
    closedAt: row.closed_at ? new Date(row.closed_at) : null,
    firstSeenAt: new Date(row.first_seen_at),
    lastSeenAt: new Date(row.last_seen_at),
    movedAt: new Date(row.moved_at),
    createdAt: new Date(row.created_at),
  };
}

export function rowToSettings(row: IncidentSettingsRow) {
  return {
    stagnationDays: row.stagnation_days,
    archiveDays: row.archive_days,
    recurrenceThreshold: row.recurrence_threshold,
    recidiveWindowDays: row.recidive_window_days,
  };
}

/** Champs d'un IncidentDraft qui vont tels quels dans un insert (hors id/number). */
export function draftToInsertRow(draft: IncidentDraft) {
  return {
    title: draft.title,
    description: draft.description,
    borne_id: draft.borneId,
    signal_type: draft.signalType,
    source: draft.source,
    priority: draft.priority,
    origin: draft.origin,
    intervention: draft.intervention,
    solution: draft.solution,
    assignee_id: draft.assigneeId,
    column_id: draft.columnId,
    occurrences: draft.occurrences,
    episodes: draft.episodes,
    returned: draft.returned,
    down_since: draft.downSince?.toISOString() ?? null,
    planned_at: draft.plannedAt,
    obs_started_at: draft.obsStartedAt?.toISOString() ?? null,
    closed_at: draft.closedAt?.toISOString() ?? null,
    first_seen_at: draft.firstSeenAt.toISOString(),
    last_seen_at: draft.lastSeenAt.toISOString(),
    moved_at: draft.movedAt.toISOString(),
    created_at: draft.createdAt.toISOString(),
  };
}

/** Champs d'un Incident complet qui vont tels quels dans un update (hors id/number/created_at). */
export function incidentToUpdateRow(incident: Incident) {
  const row = draftToInsertRow(incident);
  return row;
}

export function incidentEventRowToNote(row: IncidentEventRow) {
  return {
    id: row.id,
    kind: row.kind,
    authorId: row.author_id,
    body: row.body,
    createdAt: new Date(row.created_at),
  };
}
