import { indexColumns, requireRole, validateColumns } from "./columns";
import type { Change, Column, Incident, NewEvent } from "./types";

const userEvent = (authorId: string | null, body: string): NewEvent => ({
  kind: "event",
  authorId,
  body,
});

export interface ColumnPlan {
  errors: string[];
  /** Incidents à mettre à jour (seulement ceux qui changent). */
  updates: Change[];
}

function followMove(id: string, moves: Readonly<Record<string, string>>): string {
  let current = id;
  for (let guard = 0; guard < 20; guard += 1) {
    const next = moves[current];
    if (!next) break;
    current = next;
  }
  return current;
}

/** Replie un incident sur sa colonne cible (RG-16) ; renvoie null si rien ne change. */
function planOneIncident(
  incident: Incident,
  target: Column,
  targetId: string,
  actorId: string,
  now: Date,
): Change | null {
  const next: Incident = { ...incident };
  const events: NewEvent[] = [];
  if (targetId !== incident.columnId) {
    next.columnId = targetId;
    next.movedAt = now;
    events.push(userEvent(actorId, `Colonne supprimée : déplacé vers « ${target.name} ».`));
  }
  next.obsStartedAt = target.role === "observation" ? (next.obsStartedAt ?? now) : null;
  if (target.role === "cloture" && !next.closedAt) next.closedAt = now;

  const changed =
    events.length > 0 ||
    next.obsStartedAt !== incident.obsStartedAt ||
    next.closedAt !== incident.closedAt;
  return changed ? { incident: next, events } : null;
}

/**
 * RG-16 : enregistrement des paramètres de colonnes.
 * @param moves colonne supprimée -> colonne de destination (les chaînes sont suivies).
 * Les incidents d'une colonne disparue sans destination vont dans l'Entrée.
 */
export function planColumnChanges(
  incidents: readonly Incident[],
  newColumns: readonly Column[],
  moves: Readonly<Record<string, string>>,
  actorId: string,
  now: Date,
): ColumnPlan {
  const errors = validateColumns(newColumns);
  if (errors.length) return { errors, updates: [] };
  const byId = indexColumns(newColumns);
  const entree = requireRole(newColumns, "entree");

  const updates: Change[] = [];
  for (const incident of incidents) {
    let targetId = followMove(incident.columnId, moves);
    if (!byId.has(targetId)) targetId = entree.id;
    const target = byId.get(targetId) as Column;
    const plan = planOneIncident(incident, target, targetId, actorId, now);
    if (plan) updates.push(plan);
  }
  return { errors: [], updates };
}
