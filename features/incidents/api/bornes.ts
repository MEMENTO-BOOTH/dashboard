import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type IncidentBorne = {
  id: string;
  code: string;
  nomLieu: string;
  ville: string;
  logoUrl: string | null;
};

/** Résumé des bornes pour l'affichage des cartes (« MB-xx · bar · ville »). */
export async function getBornesForIncidents(): Promise<IncidentBorne[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bornes")
    .select("id, code, nom_lieu, ville, logo_url")
    .order("code");
  if (error) throw new Error(error.message);
  return (data ?? []).map((b) => ({
    id: b.id,
    code: b.code,
    nomLieu: b.nom_lieu,
    ville: b.ville,
    logoUrl: b.logo_url,
  }));
}
