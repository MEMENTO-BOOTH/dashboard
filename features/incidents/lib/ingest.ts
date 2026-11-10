import { indexColumns, requireRole } from "./columns";
import { daysBetween, formatDurationFr } from "./format";
import {
  type Change,
  type Column,
  DEFAULT_SETTINGS,
  type Incident,
  type IncidentDraft,
  type NewEvent,
  type Settings,
  type SignalRule,
} from "./types";

const autoEvent = (body: string): NewEvent => ({ kind: "event", authorId: null, body });

/** Clé de verrou pour traiter un couple (type de signal + borne) un seul à la fois. */
export const incidentKey = (signalType: string, borneId: string): string =>
  `${signalType}|${borneId}`;

export interface IngestInput {
  signalType: string;
  borneId: string;
  at: Date;
  rule: SignalRule;
  columns: readonly Column[];
  /** Tous les incidents du même couple (type + borne), dans n'importe quel ordre. */
  sameKeyIncidents: readonly Incident[];
  /** Le couple figure-t-il dans signal_ignores ? */
  isIgnored: boolean;
  settings?: Settings;
}

export type IngestResult =
  | { action: "ignored" }
  | { action: "merged"; incident: Incident; events: NewEvent[] }
  | { action: "reopened"; from: "observation" | "cloture"; incident: Incident; events: NewEvent[] }
  | { action: "created"; incident: IncidentDraft; events: NewEvent[] };

/** RG-04 : le signal revient pendant la surveillance, ou peu après une clôture. */
function tryReopen(
  last: Incident,
  role: "observation" | "cloture",
  entree: Column,
  rule: SignalRule,
  at: Date,
): IngestResult {
  const incident: Incident = {
    ...last,
    columnId: entree.id,
    movedAt: at,
    returned: true,
    episodes: last.episodes + 1,
    occurrences: last.occurrences + 1,
    lastSeenAt: at,
    obsStartedAt: null,
    closedAt: null,
    downSince: rule.takesBorneDown ? at : last.downSince,
  };
  const body =
    role === "observation"
      ? `Le signal est revenu pendant la surveillance : retour dans « ${entree.name} ».`
      : `Le signal est revenu ${formatDurationFr(at.getTime() - (last.closedAt as Date).getTime())} après la clôture : incident rouvert dans « ${entree.name} ».`;
  return { action: "reopened", from: role, incident, events: [autoEvent(body)] };
}

/** RG-02 : le signal revient alors que la carte est encore ouverte et non surveillée. */
function tryMerge(last: Incident, rule: SignalRule, at: Date): IngestResult {
  const incident: Incident = {
    ...last,
    occurrences: last.occurrences + 1,
    lastSeenAt: at,
    downSince: rule.takesBorneDown && !last.downSince ? at : last.downSince,
  };
  return { action: "merged", incident, events: [] };
}

/** RG-04/RG-02 : que faire du dernier incident connu pour ce couple, s'il existe. */
function handleLastIncident(
  last: Incident,
  columnsById: ReadonlyMap<string, Column>,
  entree: Column,
  rule: SignalRule,
  at: Date,
  settings: Settings,
): IngestResult | null {
  const role = columnsById.get(last.columnId)?.role;
  const closedRecently =
    role === "cloture" &&
    last.closedAt !== null &&
    daysBetween(last.closedAt, at) < settings.recidiveWindowDays;

  if (role === "observation" || closedRecently) {
    return tryReopen(last, role === "observation" ? "observation" : "cloture", entree, rule, at);
  }
  if (role === "entree" || role === "libre") return tryMerge(last, rule, at);
  return null; // Rejet, ou Clôture ancienne : nouvel incident (RG-01).
}

/** RG-01, RG-03, RG-12 : aucun incident réutilisable, on en crée un nouveau. */
function createIncidentDraft(
  input: Pick<IngestInput, "signalType" | "borneId" | "rule">,
  entree: Column,
  sameKey: readonly Incident[],
  at: Date,
  settings: Settings,
): { incident: IncidentDraft; events: NewEvent[] } {
  const { signalType, borneId, rule } = input;
  const recent = sameKey.filter(
    (i) => daysBetween(i.createdAt, at) < settings.recidiveWindowDays,
  ).length;
  const episodes = recent + 1;
  const incident: IncidentDraft = {
    title: rule.label,
    description: "",
    borneId,
    signalType,
    source: "auto",
    priority: rule.defaultPriority,
    origin: rule.defaultOrigin,
    intervention: null,
    solution: null,
    assigneeId: null,
    columnId: entree.id,
    occurrences: 1,
    episodes,
    returned: false,
    downSince: rule.takesBorneDown ? at : null,
    plannedAt: null,
    obsStartedAt: null,
    closedAt: null,
    firstSeenAt: at,
    lastSeenAt: at,
    movedAt: at,
    createdAt: at,
  };
  const events = [
    autoEvent(
      `Créé automatiquement par le signal « ${rule.label} ». Priorité P${rule.defaultPriority} fixée par la règle.`,
    ),
  ];
  if (episodes >= settings.recurrenceThreshold) {
    events.push(
      autoEvent(
        `${episodes}e épisode sur cette borne en ${settings.recidiveWindowDays} jours : marqué récurrent.`,
      ),
    );
  }
  return { incident, events };
}

/**
 * Décide quoi faire d'un signal. Pour un signal d'état, n'appeler qu'à son apparition
 * (voir CAHIER-DES-CHARGES.md, section 6). À exécuter sous verrou incidentKey().
 */
export function ingestSignal(input: IngestInput): IngestResult {
  const { signalType, borneId, at, rule } = input;
  const settings = input.settings ?? DEFAULT_SETTINGS;
  if (rule.signalType !== signalType)
    throw new Error("La règle ne correspond pas au type de signal.");
  if (input.isIgnored) return { action: "ignored" }; // RG-05

  const columnsById = indexColumns(input.columns);
  const entree = requireRole(input.columns, "entree");
  const sameKey = input.sameKeyIncidents.filter(
    (i) => i.signalType === signalType && i.borneId === borneId,
  );
  const last = [...sameKey].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  if (last) {
    const result = handleLastIncident(last, columnsById, entree, rule, at, settings);
    if (result) return result;
  }

  const { incident, events } = createIncidentDraft(
    { signalType, borneId, rule },
    entree,
    sameKey,
    at,
    settings,
  );
  return { action: "created", incident, events };
}

/** RG-19 : un signal d'état est revenu à la normale. L'incident reste dans sa colonne. */
export function signalCleared(incident: Incident, at: Date): Change {
  const wasDown = incident.downSince !== null;
  const body = wasDown
    ? `Signal rétabli : la borne fonctionne de nouveau (hors service pendant ${formatDurationFr(at.getTime() - (incident.downSince as Date).getTime())}).`
    : "Signal rétabli.";
  return { incident: { ...incident, downSince: null }, events: [autoEvent(body)] };
}
