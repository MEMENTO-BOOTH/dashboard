-- Page « Incidents » : tableau kanban de suivi des pannes/bugs des bornes.
-- Adapté de CAHIER-DES-CHARGES.md + schema-incidents.sql (livrable encadrant, 8 nov 2026).
-- borne_id/assignee_id/author_id/created_by référencent les tables réelles bornes/utilisateurs
-- (toutes deux en uuid). Les codes de signal_rules sont ceux déjà utilisés par alertes.type.

begin;

create type incident_column_role as enum ('entree', 'libre', 'observation', 'cloture', 'rejete');
create type incident_source       as enum ('auto', 'bar', 'manuel');
create type incident_origin       as enum ('diag', 'logiciel', 'materiel', 'reseau');
create type incident_intervention as enum ('distance', 'surplace');
create type incident_solution     as enum ('provisoire', 'definitive');
create type incident_event_kind   as enum ('event', 'note');
create type signal_kind           as enum ('etat', 'evenement');

create table incident_columns (
  id               uuid primary key default gen_random_uuid(),
  name             text not null check (char_length(btrim(name)) between 1 and 40),
  role             incident_column_role not null,
  observation_days smallint check (observation_days between 1 and 60),
  position         smallint not null,
  created_at       timestamptz not null default now(),
  constraint observation_days_si_observation
    check ((role = 'observation') = (observation_days is not null))
);

create table signal_rules (
  signal_type       text primary key,
  label             text not null,
  default_priority  smallint not null check (default_priority between 1 and 5),
  default_origin    incident_origin not null default 'diag',
  takes_borne_down  boolean not null default false,
  kind              signal_kind not null
);

create table incidents (
  id              uuid primary key default gen_random_uuid(),
  number          bigint generated always as identity unique,
  title           text not null check (char_length(btrim(title)) between 1 and 90),
  description     text not null default '',
  borne_id        uuid not null references bornes (id) on delete cascade,
  signal_type     text references signal_rules (signal_type) on update cascade,
  source          incident_source not null,
  priority        smallint not null check (priority between 1 and 5),
  origin          incident_origin not null default 'diag',
  intervention    incident_intervention,
  solution        incident_solution,
  assignee_id     uuid references utilisateurs (id) on delete set null,
  column_id       uuid not null references incident_columns (id),
  occurrences     integer not null default 1 check (occurrences >= 1),
  episodes        integer not null default 1 check (episodes >= 1),
  returned        boolean not null default false,
  down_since      timestamptz,
  planned_at      date,
  obs_started_at  timestamptz,
  closed_at       timestamptz,
  first_seen_at   timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),
  moved_at        timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint signal_si_auto check (source <> 'auto' or signal_type is not null)
);

create index incidents_colonne_tri on incidents (column_id, priority, created_at);
create index incidents_empreinte   on incidents (signal_type, borne_id, created_at desc);
create index incidents_borne       on incidents (borne_id, created_at desc);

create table incident_events (
  id           uuid primary key default gen_random_uuid(),
  incident_id  uuid not null references incidents (id) on delete cascade,
  kind         incident_event_kind not null,
  author_id    uuid references utilisateurs (id) on delete set null,
  body         text not null check (char_length(body) between 1 and 4000),
  created_at   timestamptz not null default now()
);

create index incident_events_fil on incident_events (incident_id, created_at);

create table signal_ignores (
  signal_type  text not null references signal_rules (signal_type) on update cascade,
  borne_id     uuid not null references bornes (id) on delete cascade,
  created_by   uuid references utilisateurs (id) on delete set null,
  reason       text,
  created_at   timestamptz not null default now(),
  primary key (signal_type, borne_id)
);

-- Une seule ligne de réglages. last_ingested_at = curseur du cron d'ingestion
-- (features/incidents/ingest.ts) : ne traite que les alertes créées après cette date.
create table incident_settings (
  id                    boolean primary key default true check (id),
  stagnation_days       smallint not null default 5  check (stagnation_days between 1 and 60),
  archive_days          smallint not null default 30 check (archive_days between 1 and 365),
  recurrence_threshold  smallint not null default 3  check (recurrence_threshold between 2 and 20),
  recidive_window_days  smallint not null default 30 check (recidive_window_days between 1 and 365),
  last_ingested_at      timestamptz not null default now()
);

-- Dernier état connu des signaux « état », pour n'appeler ingestSignal qu'à
-- l'apparition et signalCleared qu'à la disparition (CAHIER-DES-CHARGES.md, section 6).
create table signal_states (
  signal_type  text not null references signal_rules (signal_type) on update cascade,
  borne_id     uuid not null references bornes (id) on delete cascade,
  active       boolean not null,
  changed_at   timestamptz not null default now(),
  primary key (signal_type, borne_id)
);

create function incidents_touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger incidents_updated_at
  before update on incidents
  for each row execute function incidents_touch_updated_at();

alter table incident_columns enable row level security;
alter table signal_rules enable row level security;
alter table incidents enable row level security;
alter table incident_events enable row level security;
alter table signal_ignores enable row level security;
alter table incident_settings enable row level security;
alter table signal_states enable row level security;

-- Accès réservé au dashboard : toutes les lectures/écritures passent par
-- createAdminClient() (service_role), comme pour alertes/interventions.
create policy "Lecture incident_columns pour utilisateurs authentifiés" on incident_columns
  for select to authenticated using (true);
create policy "Lecture signal_rules pour utilisateurs authentifiés" on signal_rules
  for select to authenticated using (true);
create policy "Lecture incidents pour utilisateurs authentifiés" on incidents
  for select to authenticated using (true);
create policy "Lecture incident_events pour utilisateurs authentifiés" on incident_events
  for select to authenticated using (true);
create policy "Lecture signal_ignores pour utilisateurs authentifiés" on signal_ignores
  for select to authenticated using (true);
create policy "Lecture incident_settings pour utilisateurs authentifiés" on incident_settings
  for select to authenticated using (true);

insert into incident_columns (name, role, observation_days, position) values
  ('À traiter',                  'entree',      null, 1),
  ('En cours',                   'libre',       null, 2),
  ('En attente d''intervention', 'libre',       null, 3),
  ('À vérifier J+7',             'observation', 7,    4),
  ('Traité',                     'cloture',     null, 5),
  ('Fausses alertes',            'rejete',      null, 6);

-- Codes alignés sur les valeurs réelles de alertes.type (requête de production, 10 nov 2026).
insert into signal_rules (signal_type, label, default_priority, default_origin, takes_borne_down, kind) values
  ('camera_deconnectee',       'Appareil photo déconnecté',               1, 'materiel', true,  'etat'),
  ('imprimante_deconnectee',   'Imprimante déconnectée',                  1, 'materiel', true,  'etat'),
  ('fin_papier',               'Plus de papier',                         1, 'materiel', true,  'etat'),
  ('fin_ruban',                'Plus de ruban',                          1, 'materiel', true,  'etat'),
  ('borne_eteinte_3_jours',    'Borne éteinte depuis plus de 3 jours',    1, 'diag',     true,  'etat'),
  ('crash_dslrbooth',          'Crash dslrBooth',                        1, 'logiciel', true,  'evenement'),
  ('kapsule_exe_absent',       'Kapsule Bar introuvable',                 1, 'logiciel', true,  'etat'),
  ('papier_bas',               'Papier bas',                             2, 'materiel', false, 'etat'),
  ('capot_ouvert',             'Capot ouvert',                           2, 'materiel', false, 'etat'),
  ('drive_sync_cassee',        'Synchronisation Drive cassée',           2, 'logiciel', false, 'etat'),
  ('disque_plein',             'Disque plein',                           2, 'materiel', false, 'etat'),
  ('bourrage_papier',          'Bourrage imprimante',                    2, 'materiel', false, 'evenement'),
  ('erreur_ruban',             'Erreur ruban',                           2, 'materiel', false, 'evenement'),
  ('kapsule_fige',             'Kapsule Bar figé',                       2, 'logiciel', false, 'evenement'),
  ('kapsule_ferme',            'Kapsule Bar fermé',                      2, 'logiciel', false, 'etat'),
  ('erreur_mecanique',         'Erreur mécanique',                       2, 'materiel', false, 'evenement'),
  ('crash_cashinterface',      'Crash interface de paiement',            2, 'logiciel', false, 'evenement'),
  ('drive_deconnecte',         'Drive déconnecté',                       3, 'logiciel', false, 'etat'),
  ('borne_hors_ligne',         'Borne hors ligne (internet)',            3, 'reseau',   false, 'etat'),
  ('disque_bas',               'Disque bas',                             3, 'materiel', false, 'etat'),
  ('code_generation_failed',   'Génération de code e-memento échouée',   3, 'logiciel', false, 'evenement'),
  ('kapsule_health_illisible', 'Rapport santé Kapsule illisible',        3, 'logiciel', false, 'evenement'),
  ('coupe_incoherente',        'Coupe papier incohérente',               4, 'logiciel', false, 'evenement');

insert into incident_settings default values;

commit;
