import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { InterventionStatut } from "@/lib/supabase/extensions";

export type Jeton = {
  id: string;
  type: string;
  description: string | null;
  date: string;
  deadline: string | null;
  statut: InterventionStatut;
  commentaire: string | null;
  termineAt: string | null;
  borneNom: string;
  borneId: string;
  dureeMinutes: number | null;
};

export async function getJetonsForUser(userId: string): Promise<Jeton[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interventions")
    // biome-ignore lint/suspicious/noExplicitAny: colonnes ajoutées via migration, types.ts à regénérer
    .select(
      "id, type, description, date, duree_minutes, borne_id, statut, deadline, commentaire_terminaison, termine_at, bornes(nom_lieu)" as any,
    )
    .eq("intervenant_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;

  // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas les nouvelles colonnes
  return ((data ?? []) as any[]).map((row) => ({
    id: row.id,
    type: row.type,
    description: row.description,
    date: row.date,
    deadline: row.deadline ?? null,
    statut: (row.statut as InterventionStatut) ?? "en_cours",
    commentaire: row.commentaire_terminaison ?? null,
    termineAt: row.termine_at ?? null,
    dureeMinutes: row.duree_minutes,
    borneId: row.borne_id,
    borneNom: row.bornes?.nom_lieu ?? "—",
  }));
}
