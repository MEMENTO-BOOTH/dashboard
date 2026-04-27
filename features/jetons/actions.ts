"use server";

import { revalidatePath } from "next/cache";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function terminerJeton(
  id: string,
  input: { dureeMinutes: number; note: string },
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session) return { ok: false, error: "Non authentifié" };
  if (!can(session.permissions, "interventions.complete"))
    return { ok: false, error: "Permission refusée" };

  const supabase = createAdminClient();

  const { data: current, error: fetchError } = await supabase
    .from("interventions")
    .select("id, intervenant_id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !current) return { ok: false, error: "Intervention introuvable" };
  if (current.intervenant_id !== session.id)
    return { ok: false, error: "Intervention non assignée" };

  const { error } = await supabase
    .from("interventions")
    // biome-ignore lint/suspicious/noExplicitAny: colonnes ajoutées via migration, types.ts à regénérer
    .update({
      duree_minutes: input.dureeMinutes,
      statut: "terminee",
      commentaire_terminaison: input.note.trim() || null,
      termine_at: new Date().toISOString(),
    } as any)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/jetons");
  return { ok: true };
}
