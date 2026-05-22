-- Suppression des tables de l'ancien système de mise à jour basé sur Supabase Storage.
-- Les mises à jour passent maintenant par GitHub Releases : l'agent télécharge
-- l'installeur directement depuis l'API GitHub (cf. supabase_client.get_latest_github_release).
--
-- Prérequis : déployer d'abord la version de l'agent qui n'écrit plus dans updates_bornes
--            et la version du dashboard qui ne lit plus updates / updates_bornes.

-- 1. Table de tracking install par borne
drop table if exists public.updates_bornes;

-- 2. Table des releases publiées (héritage Supabase Storage)
drop table if exists public.updates;
