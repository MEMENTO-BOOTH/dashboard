import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type Intervention = {
  id: string;
  borne_id: string;
  borne_nom: string;
  type: string;
  description: string | null;
  date: string;
  duree_minutes: number | null;
  intervenant_nom: string | null;
};

export async function getInterventionsByBorne(borneId: string): Promise<Intervention[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interventions")
    .select("*, bornes(nom_lieu), utilisateurs(nom)")
    .eq("borne_id", borneId)
    .order("date", { ascending: false })
    .limit(10);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    borne_id: row.borne_id,
    borne_nom: row.bornes?.nom_lieu ?? "—",
    type: row.type,
    description: row.description,
    date: row.date,
    duree_minutes: row.duree_minutes,
    intervenant_nom: row.utilisateurs?.nom ?? "—",
  }));
}

export async function getInterventions(): Promise<Intervention[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("interventions")
    .select("*, bornes(nom_lieu), utilisateurs(nom)")
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    borne_id: row.borne_id,
    borne_nom: row.bornes?.nom_lieu ?? "—",
    type: row.type,
    description: row.description,
    date: row.date,
    duree_minutes: row.duree_minutes,
    intervenant_nom: row.utilisateurs?.nom ?? "—",
  }));
}
