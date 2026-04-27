"use server";

import { revalidatePath } from "next/cache";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteIntervention(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session) return { ok: false, error: "Non authentifié" };
  if (!can(session.permissions, "interventions.delete"))
    return { ok: false, error: "Permission refusée" };

  const supabase = createAdminClient();
  const { error } = await supabase.from("interventions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/parc/interventions");
  revalidatePath(`/parc/bornes`, "layout");
  return { ok: true };
}

export async function createIntervention(formData: FormData) {
  const session = await getSessionUser();
  if (!session) throw new Error("Non authentifié");
  if (!can(session.permissions, "interventions.create"))
    throw new Error("Permission refusée");

  const supabase = createAdminClient();

  const borne_id = formData.get("borne_id") as string;
  const type = formData.get("type") as string;
  const description = (formData.get("description") as string) || null;
  const duree = formData.get("duree_minutes") as string;
  const intervenant_id = formData.get("intervenant_id") as string;

  const { error } = await supabase.from("interventions").insert({
    borne_id,
    type,
    description,
    duree_minutes: duree ? Number(duree) : null,
    intervenant_id,
  });

  if (error) throw error;

  revalidatePath("/parc/interventions");
}
