"use client";

import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import {
  type Column,
  type Incident,
  isRecurrent,
  type Origin,
  type Settings,
  seriesSize,
} from "../lib";

const filterParsers = {
  q: parseAsString.withDefault(""),
  priority: parseAsArrayOf(parseAsInteger).withDefault([]),
  origin: parseAsString.withDefault(""),
  borne: parseAsString.withDefault(""),
  assignee: parseAsString.withDefault(""), // "" = tous, "me", "none", ou un id
  recurrent: parseAsBoolean.withDefault(false),
  serie: parseAsBoolean.withDefault(false),
  surplace: parseAsBoolean.withDefault(false),
};

export type IncidentFilters = {
  q: string;
  priority: number[];
  origin: string;
  borne: string;
  assignee: string;
  recurrent: boolean;
  serie: boolean;
  surplace: boolean;
};

export const defaultIncidentFilters: IncidentFilters = {
  q: "",
  priority: [],
  origin: "",
  borne: "",
  assignee: "",
  recurrent: false,
  serie: false,
  surplace: false,
};

export function useIncidentFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers);
  return { filters, setFilters };
}

export function hasActiveFilters(filters: IncidentFilters): boolean {
  return (
    filters.q.trim() !== "" ||
    filters.priority.length > 0 ||
    filters.origin !== "" ||
    filters.borne !== "" ||
    filters.assignee !== "" ||
    filters.recurrent ||
    filters.serie ||
    filters.surplace
  );
}

type FilterContext = {
  currentUserId: string;
  borneLabel: (borneId: string) => string;
  columnsById: ReadonlyMap<string, Column>;
  settings: Settings;
};

function matchesAssignee(incident: Incident, assignee: string, currentUserId: string): boolean {
  if (!assignee) return true;
  if (assignee === "me") return incident.assigneeId === currentUserId;
  if (assignee === "none") return !incident.assigneeId;
  return incident.assigneeId === assignee;
}

function matchesToggles(
  incident: Incident,
  filters: IncidentFilters,
  allIncidents: readonly Incident[],
  context: FilterContext,
): boolean {
  if (filters.recurrent && !isRecurrent(incident, context.settings)) return false;
  if (filters.serie && seriesSize(incident, allIncidents, context.columnsById) === 0) return false;
  if (filters.surplace && incident.intervention !== "surplace") return false;
  return true;
}

function matchesSearch(
  incident: Incident,
  q: string,
  borneLabel: (borneId: string) => string,
): boolean {
  if (q.length === 0) return true;
  const haystack =
    `${incident.title} ${borneLabel(incident.borneId)} ${incident.description}`.toLowerCase();
  return haystack.includes(q);
}

export function filterIncidents(
  incidents: readonly Incident[],
  filters: IncidentFilters,
  context: FilterContext,
): Incident[] {
  const q = filters.q.trim().toLowerCase();
  return incidents.filter((incident) => {
    if (filters.priority.length > 0 && !filters.priority.includes(incident.priority)) return false;
    if (filters.origin && incident.origin !== (filters.origin as Origin)) return false;
    if (filters.borne && incident.borneId !== filters.borne) return false;
    if (!matchesAssignee(incident, filters.assignee, context.currentUserId)) return false;
    if (!matchesToggles(incident, filters, incidents, context)) return false;
    return matchesSearch(incident, q, context.borneLabel);
  });
}
