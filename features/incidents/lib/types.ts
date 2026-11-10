// Types et référentiels partagés par la logique métier Incidents (lib/*).
// Port de incidents-rules.ts (livrable encadrant, 8 nov 2026). Références RG-xx
// -> CAHIER-DES-CHARGES.md, section 5.

export type ColumnRole = "entree" | "libre" | "observation" | "cloture" | "rejete";
export type Priority = 1 | 2 | 3 | 4 | 5;
export type Origin = "diag" | "logiciel" | "materiel" | "reseau";
export type Source = "auto" | "bar" | "manuel";
export type InterventionMode = "distance" | "surplace";
export type SolutionKind = "provisoire" | "definitive";
export type SignalKind = "etat" | "evenement";

export interface Column {
  id: string;
  name: string;
  role: ColumnRole;
  observationDays: number | null;
  position: number;
}

export interface SignalRule {
  signalType: string;
  label: string;
  defaultPriority: Priority;
  defaultOrigin: Origin;
  takesBorneDown: boolean;
  kind: SignalKind;
}

export interface Settings {
  stagnationDays: number;
  archiveDays: number;
  recurrenceThreshold: number;
  recidiveWindowDays: number;
}

export interface Incident {
  id: string;
  number: number;
  title: string;
  description: string;
  borneId: string;
  signalType: string | null;
  source: Source;
  priority: Priority;
  origin: Origin;
  intervention: InterventionMode | null;
  solution: SolutionKind | null;
  assigneeId: string | null;
  columnId: string;
  occurrences: number;
  episodes: number;
  returned: boolean;
  downSince: Date | null;
  plannedAt: string | null;
  obsStartedAt: Date | null;
  closedAt: Date | null;
  firstSeenAt: Date;
  lastSeenAt: Date;
  movedAt: Date;
  createdAt: Date;
}

export type IncidentDraft = Omit<Incident, "id" | "number">;

export interface NewEvent {
  kind: "event" | "note";
  authorId: string | null;
  body: string;
}

export interface Change<T = Incident> {
  incident: T;
  events: NewEvent[];
}

export const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  stagnationDays: 5,
  archiveDays: 30,
  recurrenceThreshold: 3,
  recidiveWindowDays: 30,
};

export const PRIORITIES: Readonly<Record<Priority, { name: string; definition: string }>> = {
  1: {
    name: "Critique",
    definition:
      "Borne hors service pendant les heures d'ouverture : elle n'encaisse plus ou n'imprime plus.",
  },
  2: {
    name: "Majeur",
    definition: "La borne marche à moitié : CB en panne mais pièces acceptées, impression pâle…",
  },
  3: {
    name: "Moyen",
    definition: "Gênant mais contournable : texte manquant, redémarrage à la main nécessaire.",
  },
  4: { name: "Mineur", definition: "Petit défaut sur une borne, sans effet sur les ventes." },
  5: { name: "Cosmétique", definition: "Détail d'affichage ou idée d'amélioration." },
};

export const ORIGIN_LABELS: Readonly<Record<Origin, string>> = {
  diag: "À diagnostiquer",
  logiciel: "Logiciel",
  materiel: "Matériel",
  reseau: "Réseau",
};

export const ROLE_LABELS: Readonly<Record<ColumnRole, string>> = {
  entree: "Entrée",
  libre: "Libre",
  observation: "Observation",
  cloture: "Clôture",
  rejete: "Rejet",
};

export const TITLE_MAX = 90;
export const COLUMN_NAME_MAX = 40;
export const MIN_COLUMNS = 4;
export const MAX_COLUMNS = 8;

export const isPriority = (value: unknown): value is Priority =>
  value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
