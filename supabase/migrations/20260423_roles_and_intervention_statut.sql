-- Rôles personnalisés + statut/échéance sur interventions
-- À appliquer via Supabase CLI ou SQL editor.

-- 1. Table roles (rôles custom créés via l'UI /utilisateurs/roles)
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  permissions jsonb not null default '[]'::jsonb,
  system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists roles_slug_idx on public.roles(slug);

-- Seed des rôles système existants (admin / technicien / partenaire)
insert into public.roles (slug, name, description, permissions, system) values
  ('admin', 'Admin', 'Accès complet à toutes les fonctionnalités',
   '["finance.view","utilisateurs.manage","roles.manage","bornes.edit","bornes.delete","interventions.create","interventions.complete","interventions.delete","jetons.view"]'::jsonb,
   true),
  ('technicien', 'Technicien', 'Interventions et maintenance du parc',
   '["bornes.edit","interventions.create","interventions.complete","jetons.view"]'::jsonb,
   true),
  ('partenaire', 'Partenaire', 'Consultation limitée à son parc',
   '[]'::jsonb,
   true)
on conflict (slug) do nothing;

-- 2. FK role_id sur utilisateurs (optionnelle : si null → dérivation depuis l'enum role existant)
alter table public.utilisateurs
  add column if not exists role_id uuid references public.roles(id) on delete set null;

-- 3. Colonnes statut / deadline / commentaire sur interventions (feature Jetons)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'intervention_statut') then
    create type public.intervention_statut as enum ('en_cours', 'terminee', 'annulee');
  end if;
end $$;

alter table public.interventions
  add column if not exists statut public.intervention_statut not null default 'en_cours',
  add column if not exists deadline timestamptz,
  add column if not exists commentaire_terminaison text,
  add column if not exists termine_at timestamptz;

create index if not exists interventions_intervenant_statut_idx
  on public.interventions(intervenant_id, statut);
