"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createIntervention(formData: FormData) {
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
