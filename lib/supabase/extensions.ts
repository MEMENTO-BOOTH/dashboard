// Extensions manuelles de la base Supabase pour les colonnes/tables
// ajoutées par supabase/migrations/20260423_*.sql.
// À supprimer dès que `npx supabase gen types` est relancé.

export type InterventionStatut = "en_cours" | "terminee" | "annulee";

export type RoleRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  permissions: string[];
  created_at: string;
  updated_at: string;
};

export type RoleInsert = {
  slug: string;
  name: string;
  description?: string | null;
  permissions: string[];
};

export type InterventionExt = {
  statut: InterventionStatut;
  deadline: string | null;
  commentaire_terminaison: string | null;
  termine_at: string | null;
};

// Tables ajoutées par supabase/migrations/20261110_incidents.sql (page Incidents).

export type IncidentColumnRole = "entree" | "libre" | "observation" | "cloture" | "rejete";
export type IncidentSource = "auto" | "bar" | "manuel";
export type IncidentOrigin = "diag" | "logiciel" | "materiel" | "reseau";
export type IncidentIntervention = "distance" | "surplace";
export type IncidentSolution = "provisoire" | "definitive";
export type IncidentEventKind = "event" | "note";
export type SignalKind = "etat" | "evenement";

export type IncidentColumnRow = {
  id: string;
  name: string;
  role: IncidentColumnRole;
  observation_days: number | null;
  position: number;
  created_at: string;
};

export type SignalRuleRow = {
  signal_type: string;
  label: string;
  default_priority: number;
  default_origin: IncidentOrigin;
  takes_borne_down: boolean;
  kind: SignalKind;
};

export type IncidentRow = {
  id: string;
  number: number;
  title: string;
  description: string;
  borne_id: string;
  signal_type: string | null;
  source: IncidentSource;
  priority: number;
  origin: IncidentOrigin;
  intervention: IncidentIntervention | null;
  solution: IncidentSolution | null;
  assignee_id: string | null;
  column_id: string;
  occurrences: number;
  episodes: number;
  returned: boolean;
  down_since: string | null;
  planned_at: string | null;
  obs_started_at: string | null;
  closed_at: string | null;
  first_seen_at: string;
  last_seen_at: string;
  moved_at: string;
  created_at: string;
  updated_at: string;
};

export type IncidentEventRow = {
  id: string;
  incident_id: string;
  kind: IncidentEventKind;
  author_id: string | null;
  body: string;
  created_at: string;
};

export type SignalIgnoreRow = {
  signal_type: string;
  borne_id: string;
  created_by: string | null;
  reason: string | null;
  created_at: string;
};

export type IncidentSettingsRow = {
  id: true;
  stagnation_days: number;
  archive_days: number;
  recurrence_threshold: number;
  recidive_window_days: number;
  last_ingested_at: string;
};

export type SignalStateRow = {
  signal_type: string;
  borne_id: string;
  active: boolean;
  changed_at: string;
};
