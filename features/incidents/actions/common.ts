import "server-only";
import { can, type Permission } from "@/features/auth/permissions";
import { getSessionUser, type SessionUser } from "@/features/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireIncidentsPermission(perm: Permission): Promise<SessionUser> {
  const session = await getSessionUser();
  if (!session) throw new Error("Non authentifié");
  if (!can(session.permissions, perm)) throw new Error("Permission refusée");
  return session;
}

export async function userNameResolver(): Promise<(userId: string) => string> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("utilisateurs").select("id, nom");
  const byId = new Map((data ?? []).map((u) => [u.id, u.nom]));
  return (userId: string) => byId.get(userId) ?? "un membre de l'équipe";
}

export async function insertIncidentEvents(
  incidentId: string,
  events: ReadonlyArray<{ kind: "event" | "note"; authorId: string | null; body: string }>,
): Promise<void> {
  if (events.length === 0) return;
  const supabase = createAdminClient();
  const { error } = await supabase
    // biome-ignore lint/suspicious/noExplicitAny: table incident_events ajoutée par migration, types.ts à regénérer
    .from("incident_events" as any)
    .insert(
      events.map((e) => ({
        incident_id: incidentId,
        kind: e.kind,
        author_id: e.authorId,
        body: e.body,
      })),
    );
  if (error) throw new Error(error.message);
}
