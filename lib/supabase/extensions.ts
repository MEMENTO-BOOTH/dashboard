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
