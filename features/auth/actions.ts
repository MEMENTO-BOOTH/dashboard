"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearSession, setSession } from "./session";

export type SignInState = { error: string | null };

const signInSchema = z.object({
  nom: z.string().trim().min(1, { message: "Nom requis" }),
  pin: z.string().regex(/^\d{6}$/, { message: "PIN à 6 chiffres requis" }),
});

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    nom: formData.get("nom"),
    pin: formData.get("pin"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides" };
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("utilisateurs")
    .select("id, pin, actif")
    .ilike("nom", parsed.data.nom)
    .eq("actif", true)
    .maybeSingle();

  if (!data || data.pin !== parsed.data.pin) {
    return { error: "Nom ou code PIN incorrect." };
  }

  await setSession(data.id);
  redirect("/");
}

export async function signOutAction() {
  await clearSession();
  redirect("/login");
}
