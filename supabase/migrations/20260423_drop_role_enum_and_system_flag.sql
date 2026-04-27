-- Drop complet de l'ancien système de rôle basé sur enum.
-- Prérequis : les migrations précédentes (création de roles + backfill role_id) ont été exécutées.

-- 1. Rendre role_id obligatoire (tout user doit avoir un rôle)
alter table public.utilisateurs alter column role_id set not null;

-- 2. Supprimer la colonne enum redondante
alter table public.utilisateurs drop column role;

-- 3. Supprimer le type enum devenu inutile
drop type public.user_role;

-- 4. Supprimer la distinction système vs custom
alter table public.roles drop column system;
