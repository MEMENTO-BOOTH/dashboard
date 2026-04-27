import "server-only";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Connection, Member, UserDetail } from "./schemas";

export async function getMembers(): Promise<Member[]> {
  const supabase = createAdminClient();
  const { data: users, error } = await supabase
    .from("utilisateurs")
    // biome-ignore lint/suspicious/noExplicitAny: role_id + is_admin via migration, types.ts à regénérer
    .select("id, nom, logo_url, actif, is_admin, role_id" as any)
    .eq("actif", true)
    .order("nom");

  if (error) throw new Error(error.message);

  // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas is_admin/role_id
  const rows = (users ?? []) as any[];
  const roleIds = [...new Set(rows.map((u) => u.role_id).filter(Boolean))];

  const roleNameById = new Map<string, string>();
  if (roleIds.length > 0) {
    const { data: roles } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table roles via migration, types.ts à regénérer
      .from("roles" as any)
      .select("id, name")
      .in("id", roleIds);
    // biome-ignore lint/suspicious/noExplicitAny: cast tant que types.ts n'inclut pas roles
    for (const r of ((roles ?? []) as any[])) roleNameById.set(r.id, r.name);
  }

  return rows.map((u) => ({
    id: u.id,
    name: u.nom,
    role: u.is_admin
      ? "Admin"
      : u.role_id
        ? (roleNameById.get(u.role_id) ?? "—")
        : "—",
    logoUrl: u.logo_url ?? null,
  }));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getUserById(id: string): Promise<UserDetail> {
  if (!UUID_RE.test(id)) notFound();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("utilisateurs")
    // biome-ignore lint/suspicious/noExplicitAny: role_id via migration, types.ts à regénérer
    .select("id, nom, logo_url, created_at, voir_ca, role_id" as any)
    .eq("id", id)
    // biome-ignore lint/suspicious/noExplicitAny: cast nécessaire tant que types.ts n'inclut pas role_id
    .maybeSingle<any>();

  if (error) throw new Error(error.message);
  if (!data) notFound();

  let roleSlug = "";
  if (data.role_id) {
    const { data: role } = await supabase
      // biome-ignore lint/suspicious/noExplicitAny: table roles via migration, types.ts à regénérer
      .from("roles" as any)
      .select("slug")
      .eq("id", data.role_id)
      // biome-ignore lint/suspicious/noExplicitAny: cast tant que types.ts n'inclut pas roles
      .maybeSingle<any>();
    if (role) roleSlug = role.slug;
  }

  return {
    id: data.id,
    nom: data.nom,
    logoUrl: data.logo_url ?? null,
    created_at: data.created_at,
    role: roleSlug,
    voirCa: data.voir_ca ?? false,
  };
}

export async function getUserConnections(userId: string): Promise<Connection[]> {
  if (!UUID_RE.test(userId)) return [];

  const supabase = createAdminClient();
  // Types may not include `user_connections` yet; cast via a typed alias.
  const { data, error } = await (
    supabase as unknown as {
      from: (table: string) => {
        select: (q: string) => {
          eq: (
            col: string,
            v: string,
          ) => {
            order: (
              col: string,
              opts: { ascending: boolean },
            ) => Promise<{
              data:
                | {
                    id: string;
                    borne_id: string;
                    last_seen: string;
                    bornes: { nom_lieu: string | null; logo_url: string | null } | null;
                  }[]
                | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    }
  )
    .from("user_connections")
    .select("id, borne_id, last_seen, bornes(nom_lieu, logo_url)")
    .eq("user_id", userId)
    .order("last_seen", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    borne_id: row.borne_id,
    borne_nom: row.bornes?.nom_lieu ?? "Borne inconnue",
    borne_logo: row.bornes?.logo_url ?? null,
    last_seen: formatLastSeen(row.last_seen),
  }));
}

function formatLastSeen(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `Il y a ${diffD} j`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
