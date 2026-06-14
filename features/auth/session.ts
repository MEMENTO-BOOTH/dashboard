import "server-only";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Permissions, permissionsFromArray } from "./permissions";

const COOKIE_NAME = "capsule_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

const ALL_PERMISSIONS_GRANTED: Permissions = {
  "finance.view": true,
  "utilisateurs.manage": true,
  "roles.manage": true,
  "bornes.delete": true,
  "bornes.edit": true,
  "interventions.create": true,
  "interventions.delete": true,
  "interventions.complete": true,
  "jetons.view": true,
  "commandes.assign": true,
  "commandes.expedite": true,
};

export type SessionUser = {
  id: string;
  nom: string;
  role: string;
  roleName: string;
  logoUrl: string | null;
  voirCa: boolean;
  isAdmin: boolean;
  permissions: Permissions;
};

export async function setSession(userId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const userId = store.get(COOKIE_NAME)?.value;
  if (!userId) return null;

  const supabase = createAdminClient();
  const { data: user, error } = await supabase
    .from("utilisateurs")
    // biome-ignore lint/suspicious/noExplicitAny: role_id + is_admin via migration, types.ts à regénérer
    .select("id, nom, logo_url, actif, voir_ca, is_admin, role_id" as any)
    .eq("id", userId)
    .eq("actif", true)
    // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas is_admin/role_id
    .maybeSingle<any>();

  if (error || !user) return null;

  let roleRow: { slug: string; name: string; permissions: string[] } | null = null;
  if (user.role_id) {
    const { data: role } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table roles ajoutée via migration, types.ts à regénérer
      .from("roles" as any)
      .select("slug, name, permissions")
      .eq("id", user.role_id)
      // biome-ignore lint/suspicious/noExplicitAny: cast tant que types.ts n'inclut pas roles
      .maybeSingle<any>();
    if (role)
      roleRow = {
        slug: role.slug,
        name: role.name,
        permissions: (role.permissions ?? []) as string[],
      };
  }

  const voirCa = user.voir_ca ?? false;
  const isAdmin = user.is_admin ?? false;
  const roleSlug = roleRow?.slug ?? "";
  const roleName = roleRow?.name ?? (isAdmin ? "Admin" : "Aucun rôle");

  const permissions: Permissions = isAdmin
    ? { ...ALL_PERMISSIONS_GRANTED, "finance.view": voirCa }
    : permissionsFromArray(roleRow?.permissions ?? [], voirCa);

  return {
    id: user.id,
    nom: user.nom,
    role: roleSlug,
    roleName,
    logoUrl: user.logo_url ?? null,
    voirCa,
    isAdmin,
    permissions,
  };
}
