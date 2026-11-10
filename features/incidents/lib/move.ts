import { isFinalRole, observationDaysOf } from "./columns";
import { daysBetween } from "./format";
import type { Change, Column, Incident, NewEvent } from "./types";

const autoEvent = (body: string): NewEvent => ({ kind: "event", authorId: null, body });
const userEvent = (authorId: string | null, body: string): NewEvent => ({
  kind: "event",
  authorId,
  body,
});

export type MoveNeed = "assignee" | "origin";
export type MoveCheck = { ok: true } | { ok: false; need: MoveNeed };

export class MoveRefusedError extends Error {
  readonly need: MoveNeed;
  constructor(need: MoveNeed) {
    super(
      need === "assignee"
        ? "Un responsable est obligatoire pour cette colonne."
        : "L'origine de la panne est obligatoire pour clôturer.",
    );
    this.name = "MoveRefusedError";
    this.need = need;
  }
}

// RG-06, RG-07 : responsable obligatoire hors Entrée/Rejet, origine obligatoire pour clôturer.
export function checkMove(incident: Incident, to: Column): MoveCheck {
  if (incident.columnId === to.id) return { ok: true };
  if (to.role !== "entree" && to.role !== "rejete" && !incident.assigneeId)
    return { ok: false, need: "assignee" };
  if (to.role === "cloture" && incident.origin === "diag") return { ok: false, need: "origin" };
  return { ok: true };
}

/** RG-08, RG-14, RG-15, RG-17. Lève MoveRefusedError si checkMove refuse. */
export function applyMove(
  incident: Incident,
  from: Column,
  to: Column,
  actorId: string | null,
  now: Date,
): Change {
  if (from.id === to.id) return { incident, events: [] };
  const check = checkMove(incident, to);
  if (!check.ok) throw new MoveRefusedError(check.need);

  const events: NewEvent[] = [];
  const next: Incident = { ...incident, columnId: to.id, movedAt: now };

  if (
    from.role === "observation" &&
    to.role === "cloture" &&
    incident.obsStartedAt &&
    daysBetween(incident.obsStartedAt, now) >= observationDaysOf(from)
  ) {
    events.push(
      autoEvent(`Aucune récidive pendant les ${observationDaysOf(from)} jours de surveillance.`),
    );
  }
  events.push(userEvent(actorId, `Déplacé de « ${from.name} » vers « ${to.name} ».`));

  if (to.role === "observation") {
    next.obsStartedAt = now;
    events.push(autoEvent(`Surveillance de ${observationDaysOf(to)} jours lancée.`));
  } else {
    next.obsStartedAt = null;
  }

  if (to.role === "cloture") {
    next.closedAt = now;
    next.downSince = null;
    next.returned = false;
  } else {
    next.closedAt = null;
  }
  if (to.role === "rejete") next.downSince = null;
  if (to.role === "entree" && isFinalRole(from.role)) next.returned = true; // RG-17 réouverture

  return { incident: next, events };
}

export interface FalseAlarmResult extends Change {
  ignore: { signalType: string; borneId: string } | null;
}

// RG-18
export function markFalseAlarm(
  incident: Incident,
  from: Column,
  rejectColumn: Column,
  options: { ignoreSignal: boolean; reason?: string },
  actorId: string,
  now: Date,
): FalseAlarmResult {
  const events: NewEvent[] = [];
  const reason = options.reason?.trim();
  if (reason) events.push({ kind: "note", authorId: actorId, body: reason });
  let ignore: FalseAlarmResult["ignore"] = null;
  if (options.ignoreSignal && incident.signalType) {
    ignore = { signalType: incident.signalType, borneId: incident.borneId };
    events.push(userEvent(actorId, `Signal ignoré à l'avenir sur ${incident.borneId}.`));
  }
  const moved = applyMove(incident, from, rejectColumn, actorId, now);
  return { incident: moved.incident, events: [...events, ...moved.events], ignore };
}
