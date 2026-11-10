"use client";

import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import type { Incident } from "../lib";

const filterParsers = {
  q: parseAsString.withDefault(""),
  priority: parseAsArrayOf(parseAsInteger).withDefault([]),
  borne: parseAsString.withDefault(""),
  assignee: parseAsString.withDefault(""), // "" = tous, "none" = non attribué, sinon un id
};

export type IncidentFilters = {
  q: string;
  priority: number[];
  borne: string;
  assignee: string;
};

export function useIncidentFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers);
  return { filters, setFilters };
}

export function filterIncidents(
  incidents: readonly Incident[],
  filters: IncidentFilters,
  borneLabel: (borneId: string) => string,
): Incident[] {
  const q = filters.q.trim().toLowerCase();
  return incidents.filter((incident) => {
    if (filters.priority.length > 0 && !filters.priority.includes(incident.priority)) return false;
    if (filters.borne && incident.borneId !== filters.borne) return false;
    if (filters.assignee === "none" && incident.assigneeId) return false;
    if (filters.assignee && filters.assignee !== "none" && incident.assigneeId !== filters.assignee)
      return false;
    if (q.length === 0) return true;
    const haystack = `${incident.title} ${borneLabel(incident.borneId)}`.toLowerCase();
    return haystack.includes(q);
  });
}
