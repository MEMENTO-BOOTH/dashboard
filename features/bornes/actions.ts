"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateBorneProfile(
  id: string,
  data: { nom_lieu: string; ville: string; adresse: string },
) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("bornes")
    .update({
      nom_lieu: data.nom_lieu,
      ville: data.ville,
      adresse: data.adresse,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;

  revalidatePath(`/parc/bornes/${id}`);
  revalidatePath("/parc/bornes");
  revalidatePath("/");
}

export async function updateHoraires(
  borneId: string,
  horaires: { jour: number; ouverture: string; fermeture: string; ferme: boolean }[],
) {
  const supabase = createAdminClient();

  await supabase.from("horaires").delete().eq("borne_id", borneId);

  const rows = horaires.map((h) => ({ borne_id: borneId, ...h }));
  const { error } = await supabase.from("horaires").insert(rows);
  if (error) throw error;

  revalidatePath(`/parc/bornes/${borneId}`);
}

export async function deleteBorne(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("bornes").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/parc/bornes");
  revalidatePath("/");
  redirect("/parc/bornes");
}

export async function uploadBorneLogo(id: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file");

  const supabase = createAdminClient();

  const ext = file.name.split(".").pop() ?? "png";
  const path = `bornes/${id}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    const { error: createError } = await supabase.storage.createBucket("logos", { public: true });
    if (createError && !createError.message.includes("already exists")) throw createError;

    const { error: retryError } = await supabase.storage
      .from("logos")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (retryError) throw retryError;
  }

  const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("bornes")
    .update({ logo_url: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) throw updateError;

  revalidatePath(`/parc/bornes/${id}`);
  revalidatePath("/parc/bornes");

  return urlData.publicUrl;
}
