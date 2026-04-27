-- Fix RLS sur public.roles
-- La table roles est créée avec RLS activée par défaut sur Supabase.
-- L'accès est gated côté app par la permission 'roles.manage', donc on
-- désactive la RLS (cohérent avec l'approche des autres tables du projet).

alter table public.roles disable row level security;
