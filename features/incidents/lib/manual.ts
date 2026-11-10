import { requireRole } from "./columns";
import {
  type Change,
  type Column,
  type IncidentDraft,
  isPriority,
  type NewEvent,
  type Origin,
  type Priority,
  TITLE_MAX,
} from "./types";

const userEvent = (authorId: string | null, body: string): NewEvent => ({
  kind: "event",
  authorId,
  body,
});

export interface ManualInput {
  title: string;
  borneId: string;
  source: "manuel" | "bar";
  priority?: Priority;
  origin?: Origin;
  assigneeId?: string | null;
  description?: string;
  actorId: string;
  /** Prénom du responsable, pour l'historique. */
  assigneeName?: string;
  columns: readonly Column[];
  at: Date;
}

// RG-01 : création manuelle (depuis le dashboard ou signalée par le bar).
export function createManualIncident(input: ManualInput): Change<IncidentDraft> {
  const title = input.title.trim();
  if (title.length === 0 || title.length > TITLE_MAX)
    throw new Error(`Le titre doit faire de 1 à ${TITLE_MAX} caractères.`);
  const priority = input.priority ?? 3;
  if (!isPriority(priority)) throw new Error("Priorité invalide.");
  const entree = requireRole(input.columns, "entree");
  const at = input.at;
  const incident: IncidentDraft = {
    title,
    description: (input.description ?? "").trim(),
    borneId: input.borneId,
    signalType: null,
    source: input.source,
    priority,
    origin: input.origin ?? "diag",
    intervention: null,
    solution: null,
    assigneeId: input.assigneeId ?? null,
    columnId: entree.id,
    occurrences: 1,
    episodes: 1,
    returned: false,
    downSince: null,
    plannedAt: null,
    obsStartedAt: null,
    closedAt: null,
    firstSeenAt: at,
    lastSeenAt: at,
    movedAt: at,
    createdAt: at,
  };
  const events: NewEvent[] = [
    userEvent(
      input.actorId,
      input.source === "bar" ? "Signalé par le personnel du bar." : "Incident créé à la main.",
    ),
  ];
  if (incident.assigneeId)
    events.push(
      userEvent(input.actorId, `Attribué à ${input.assigneeName ?? "un membre de l'équipe"}.`),
    );
  return { incident, events };
}
