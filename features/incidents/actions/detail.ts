"use server";

import { getIncidentEvents, getRelatedIncidents } from "../api";
import { requireIncidentsPermission } from "./common";

export async function getIncidentDetailAction(incidentId: string, borneId: string) {
  await requireIncidentsPermission("incidents.view");
  const [events, related] = await Promise.all([
    getIncidentEvents(incidentId),
    getRelatedIncidents(borneId, incidentId),
  ]);
  return { events, related };
}
