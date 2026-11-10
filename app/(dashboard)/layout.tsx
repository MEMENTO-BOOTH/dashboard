import { redirect } from "next/navigation";
import { Shell } from "@/components/layout";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { getOpenP1Count } from "@/features/incidents/api";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  // Cookie invalide (user supprimé/désactivé) → on redirige vers /logout qui
  // purge le cookie dans une Route Handler (les layouts ne peuvent pas muter
  // les cookies en Next.js 16).
  if (!session) redirect("/logout");

  const incidentsP1Count = can(session.permissions, "incidents.view")
    ? await getOpenP1Count()
    : undefined;

  return (
    <Shell
      permissions={session.permissions}
      incidentsP1Count={incidentsP1Count}
      user={{
        name: session.nom,
        role: session.roleName,
        avatarUrl: session.logoUrl,
      }}
    >
      {children}
    </Shell>
  );
}
