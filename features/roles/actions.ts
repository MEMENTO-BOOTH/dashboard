"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { can, type Permission } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

const ALL_PERMISSIONS: Permission[] = [
  "finance.view",
  "utilisateurs.manage",
  "roles.manage",
  "bornes.delete",
  "bornes.edit",
  "interventions.create",
  "interventions.delete",
  "interventions.complete",
  "jetons.view",
];

const CreateRoleInput = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(200).optional(),
  permissions: z.array(z.enum(ALL_PERMISSIONS as [Permission, ...Permission[]])),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const PROTECTED_ROLE_SLUGS = new Set(["admin"]);

export async function deleteRole(id: string): Promise<{ ok: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session) return { ok: false, error: "Non authentifié" };
  if (!can(session.permissions, "roles.manage"))
    return { ok: false, error: "Permission refusée" };

  const supabase = createAdminClient();

  const { data: role } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table roles ajoutée via migration, types.ts à regénérer
    .from("roles" as any)
    .select("slug")
    .eq("id", id)
    // biome-ignore lint/suspicious/noExplicitAny: cast tant que types.ts n'inclut pas roles
    .maybeSingle<any>();

  if (!role) return { ok: false, error: "Rôle introuvable" };
  if (PROTECTED_ROLE_SLUGS.has(role.slug))
    return { ok: false, error: "Ce rôle système ne peut pas être supprimé." };

  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table roles ajoutée via migration, types.ts à regénérer
    .from("roles" as any)
    .delete()
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/utilisateurs/roles");
  return { ok: true };
}

export async function createRole(
  input: z.input<typeof CreateRoleInput>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session) return { ok: false, error: "Non authentifié" };
  if (!can(session.permissions, "roles.manage"))
    return { ok: false, error: "Permission refusée" };

  const parsed = CreateRoleInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const supabase = createAdminClient();
  const slug = slugify(parsed.data.name);

  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table ajoutée via migration, types.ts à regénérer
    .from("roles" as any)
    .insert({
      slug,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      permissions: parsed.data.permissions,
    } as never);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Un rôle avec ce nom existe déjà" };
    return { ok: false, error: error.message };
  }

  revalidatePath("/utilisateurs/roles");
  return { ok: true };
}
