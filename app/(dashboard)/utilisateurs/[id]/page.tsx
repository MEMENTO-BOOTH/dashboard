import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { getTokens } from "@/features/google-calendar/tokens";
import { UtilisateurDetailView } from "@/features/utilisateurs";
import { getUserById, getUserConnections } from "@/features/utilisateurs/api";

export default async function UtilisateurPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!(session && can(session.permissions, "utilisateurs.manage"))) notFound();

  const { id } = await params;
  const [user, connections, tokens] = await Promise.all([
    getUserById(id),
    getUserConnections(id),
    getTokens(id).catch(() => null),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "utilisateurs", href: "/utilisateurs" },
          { label: user.nom.split(" ")[0] ?? user.nom },
        ]}
      />
      <UtilisateurDetailView
        user={user}
        connections={connections}
        googleConnected={tokens !== null}
      />
    </div>
  );
}
