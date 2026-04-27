import { redirect } from "next/navigation";
import { Shell } from "@/components/layout";
import { getSessionUser } from "@/features/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  // Cookie invalide (user supprimé/désactivé) → on redirige vers /logout qui
  // purge le cookie dans une Route Handler (les layouts ne peuvent pas muter
  // les cookies en Next.js 16).
  if (!session) redirect("/logout");

  return (
    <Shell
      permissions={session.permissions}
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
