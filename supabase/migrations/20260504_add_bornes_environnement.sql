-- Ajout d'un canal de mise a jour par borne (prod = release, dev = pre-release).
-- L'agent Memento lit cette valeur via la table `bornes` (deja accessible via SUPABASE_KEY)
-- et appelle l'endpoint dashboard /api/agent/release/{environnement} pour recuperer la
-- version a installer.

alter table public.bornes
  add column if not exists environnement text not null default 'prod';

alter table public.bornes
  add constraint bornes_environnement_check check (environnement in ('prod', 'dev'));

comment on column public.bornes.environnement is
  'Canal de mise a jour : prod = releases full GitHub, dev = pre-releases';
