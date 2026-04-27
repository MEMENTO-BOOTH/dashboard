"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireUtilisateursManage(): Promise<void> {
  const session = await getSessionUser();
  if (!session) throw new Error("Non authentifié");
  if (!can(session.permissions, "utilisateurs.manage"))
    throw new Error("Permission refusée");
}

const createMemberSchema = z.object({
  nom: z.string().trim().min(1, "Nom requis"),
  logo_url: z.string().min(1, "Avatar requis"),
  role: z.string().trim().optional(), // slug vide/undefined = aucun rôle
  is_admin: z.boolean().optional().default(false),
  pin: z.string().regex(/^\d{6}$/, "PIN à 6 chiffres requis"),
  voir_ca: z.boolean(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export async function createMember(input: CreateMemberInput) {
  await requireUtilisateursManage();
  const parsed = createMemberSchema.parse(input);
  const supabase = createAdminClient();

  let roleId: string | null = null;
  if (parsed.role && parsed.role.length > 0) {
    const { data: roleRow, error: roleError } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table roles ajoutée via migration, types.ts à regénérer
      .from("roles" as any)
      .select("id")
      .eq("slug", parsed.role)
      // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas roles
      .maybeSingle<any>();
    if (roleError) throw new Error(roleError.message);
    if (!roleRow) throw new Error("Rôle introuvable");
    roleId = roleRow.id;
  }

  const id = crypto.randomUUID();

  const { error } = await supabase
    .from("utilisateurs")
    // biome-ignore lint/suspicious/noExplicitAny: role_id + is_admin via migration, types.ts à regénérer
    .insert({
      id,
      nom: parsed.nom,
      email: `member-${id.slice(0, 8)}@memento.local`,
      telephone: "",
      pin: parsed.pin,
      role_id: roleId,
      is_admin: parsed.is_admin,
      logo_url: parsed.logo_url,
      voir_ca: parsed.voir_ca,
      actif: true,
    } as any);

  if (error) throw new Error(error.message);

  revalidatePath("/utilisateurs");
}

const pinSchema = z.string().regex(/^\d{6}$/, "PIN à 6 chiffres requis");

export async function updateMemberPin(id: string, pin: string) {
  await requireUtilisateursManage();
  const parsed = pinSchema.parse(pin);
  const supabase = createAdminClient();

  const { error } = await supabase.from("utilisateurs").update({ pin: parsed }).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/utilisateurs/${id}`);
  revalidatePath("/utilisateurs");
}

export async function deleteMember(id: string) {
  await requireUtilisateursManage();
  const supabase = createAdminClient();

  // Empêche la suppression du dernier admin
  const { data: target } = await supabase
    .from("utilisateurs")
    // biome-ignore lint/suspicious/noExplicitAny: is_admin ajouté via migration, types.ts à regénérer
    .select("is_admin" as any)
    .eq("id", id)
    // biome-ignore lint/suspicious/noExplicitAny: cast tant que types.ts n'inclut pas is_admin
    .maybeSingle<any>();

  if (target?.is_admin) {
    const { count } = await supabase
      .from("utilisateurs")
      // biome-ignore lint/suspicious/noExplicitAny: is_admin ajouté via migration, types.ts à regénérer
      .select("id" as any, { count: "exact", head: true })
      // biome-ignore lint/suspicious/noExplicitAny: is_admin ajouté via migration, types.ts à regénérer
      .eq("is_admin" as any, true)
      .eq("actif", true);

    if ((count ?? 0) <= 1) {
      throw new Error("Impossible de supprimer le dernier administrateur.");
    }
  }

  // Cascade : virer les interventions et connections de cet user (FK l'empêchent sinon)
  await supabase.from("interventions").delete().eq("intervenant_id", id);
  // user_connections / google_tokens si elles existent
  // biome-ignore lint/suspicious/noExplicitAny: tables optionnelles selon le schéma
  await (supabase as any).from("user_connections").delete().eq("user_id", id);
  // biome-ignore lint/suspicious/noExplicitAny: tables optionnelles selon le schéma
  await (supabase as any).from("google_tokens").delete().eq("user_id", id);

  const { error } = await supabase.from("utilisateurs").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/utilisateurs");
  redirect("/utilisateurs");
}
