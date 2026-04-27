import { notFound } from "next/navigation";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { getRoles } from "@/features/roles";
import { getMembers } from "@/features/utilisateurs/api";
import { UtilisateursList } from "@/features/utilisateurs/components/utilisateurs-list";

export default async function UtilisateursPage() {
  const session = await getSessionUser();
  if (!(session && can(session.permissions, "utilisateurs.manage"))) notFound();

  const [members, roles] = await Promise.all([getMembers(), getRoles()]);
  const roleOptions = roles.map((r) => ({ slug: r.slug, name: r.name }));

  return <UtilisateursList members={members} roles={roleOptions} />;
}
