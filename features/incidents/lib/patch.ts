import { formatPlannedDate } from "./format";
import {
  type Change,
  type Incident,
  isPriority,
  type NewEvent,
  ORIGIN_LABELS,
  TITLE_MAX,
} from "./types";

const userEvent = (authorId: string | null, body: string): NewEvent => ({
  kind: "event",
  authorId,
  body,
});

export type IncidentPatch = Partial<
  Pick<
    Incident,
    | "title"
    | "description"
    | "priority"
    | "assigneeId"
    | "origin"
    | "intervention"
    | "solution"
    | "plannedAt"
  >
>;

type Log = (body: string) => void;

function patchTitle(next: Incident, incident: Incident, title: string | undefined, log: Log) {
  if (title === undefined) return;
  const trimmed = title.trim();
  if (trimmed.length === 0 || trimmed.length > TITLE_MAX)
    throw new Error(`Le titre doit faire de 1 à ${TITLE_MAX} caractères.`);
  if (trimmed === incident.title) return;
  next.title = trimmed;
  log("Titre modifié.");
}

function patchDescription(
  next: Incident,
  incident: Incident,
  description: string | undefined,
  log: Log,
) {
  if (description === undefined || description.trim() === incident.description) return;
  next.description = description.trim();
  log("Description modifiée.");
}

function patchPriority(
  next: Incident,
  incident: Incident,
  priority: Incident["priority"] | undefined,
  log: Log,
) {
  if (priority === undefined || priority === incident.priority) return;
  if (!isPriority(priority)) throw new Error("Priorité invalide.");
  next.priority = priority;
  log(`Priorité changée : P${incident.priority} → P${priority}.`);
}

function patchAssignee(
  next: Incident,
  incident: Incident,
  assigneeId: string | null | undefined,
  userName: (userId: string) => string,
  log: Log,
) {
  if (assigneeId === undefined || assigneeId === incident.assigneeId) return;
  next.assigneeId = assigneeId;
  log(assigneeId ? `Attribué à ${userName(assigneeId)}.` : "Responsable retiré.");
}

function patchOrigin(
  next: Incident,
  incident: Incident,
  origin: Incident["origin"] | undefined,
  log: Log,
) {
  if (origin === undefined || origin === incident.origin) return;
  next.origin = origin;
  log(`Origine : ${ORIGIN_LABELS[origin]}.`);
}

function patchIntervention(
  next: Incident,
  incident: Incident,
  intervention: Incident["intervention"] | undefined,
  log: Log,
) {
  if (intervention === undefined || intervention === incident.intervention) return;
  next.intervention = intervention;
  log(
    intervention
      ? `Intervention : ${intervention === "distance" ? "à distance" : "sur place"}.`
      : "Mode d'intervention retiré.",
  );
}

function patchSolution(
  next: Incident,
  incident: Incident,
  solution: Incident["solution"] | undefined,
  log: Log,
) {
  if (solution === undefined || solution === incident.solution) return;
  next.solution = solution;
  log(
    solution
      ? `Solution marquée ${solution === "provisoire" ? "provisoire : récidive probable" : "définitive"}.`
      : "Type de solution retiré.",
  );
}

function patchPlannedAt(
  next: Incident,
  incident: Incident,
  plannedAt: string | null | undefined,
  log: Log,
) {
  if (plannedAt === undefined || plannedAt === incident.plannedAt) return;
  if (plannedAt !== null && !/^\d{4}-\d{2}-\d{2}$/.test(plannedAt))
    throw new Error("Date attendue au format AAAA-MM-JJ.");
  next.plannedAt = plannedAt;
  log(
    plannedAt
      ? `Intervention prévue le ${formatPlannedDate(plannedAt)}.`
      : "Date d'intervention retirée.",
  );
}

// RG-20 : modifications de la fiche, avec historique.
export function applyPatch(
  incident: Incident,
  patch: IncidentPatch,
  actorId: string,
  userName: (userId: string) => string,
): Change {
  const next: Incident = { ...incident };
  const events: NewEvent[] = [];
  const log: Log = (body) => events.push(userEvent(actorId, body));

  patchTitle(next, incident, patch.title, log);
  patchDescription(next, incident, patch.description, log);
  patchPriority(next, incident, patch.priority, log);
  patchAssignee(next, incident, patch.assigneeId, userName, log);
  patchOrigin(next, incident, patch.origin, log);
  patchIntervention(next, incident, patch.intervention, log);
  patchSolution(next, incident, patch.solution, log);
  patchPlannedAt(next, incident, patch.plannedAt, log);

  return { incident: next, events };
}
