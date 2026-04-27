-- Backfill role_id sur utilisateurs existants à partir du slug (colonne enum role).
-- À exécuter après la migration qui crée la table roles et a seedé admin/technicien/partenaire.

update public.utilisateurs u
set role_id = r.id
from public.roles r
where u.role::text = r.slug and u.role_id is null;
