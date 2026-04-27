import "server-only";
import type { Permission } from "@/features/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";

export type Role = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  permissions: Permission[];
};

export async function getRoles(): Promise<Role[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table ajoutée via migration, types.ts à regénérer
    .from("roles" as any)
    .select("id, slug, name, description, permissions")
    .order("name");

  if (error) throw error;

  // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas roles
  return ((data ?? []) as any[]).map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    permissions: (r.permissions ?? []) as Permission[],
  }));
}
