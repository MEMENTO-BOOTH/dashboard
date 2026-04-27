import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { getRoles, RoleCard, RoleForm } from "@/features/roles";

export const revalidate = 0;

export default async function RolesPage() {
  const session = await getSessionUser();
  if (!(session && can(session.permissions, "roles.manage"))) notFound();

  const roles = await getRoles();
  // Admin en premier, puis les autres par ordre alphabétique
  const sorted = [...roles].sort((a, b) => {
    if (a.slug === "admin") return -1;
    if (b.slug === "admin") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
      <Breadcrumb items={[{ label: "Utilisateurs", href: "/utilisateurs" }, { label: "Rôles" }]} />

      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-semibold leading-8 text-foreground">Rôles et permissions</h1>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Le rôle Admin est permanent. Créez d'autres rôles pour adapter les accès à votre équipe.
        </p>
      </div>

      <section>
        {sorted.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Aucun rôle. Créez-en un ci-dessous.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((role) => (
              <RoleCard
                key={role.id}
                variant={role.slug === "admin" ? "highlighted" : "normal"}
                role={{
                  id: role.id,
                  slug: role.slug,
                  name: role.name,
                  description: role.description ?? "",
                  permissions: role.permissions,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[16px] font-semibold leading-6 text-foreground">Créer un rôle</h2>
        <RoleForm />
      </section>
    </div>
  );
}
