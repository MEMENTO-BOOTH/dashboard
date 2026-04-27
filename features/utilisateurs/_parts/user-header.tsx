import { InitialsAvatar } from "@/components/ui/initials-avatar";
import type { UserDetail } from "../schemas";

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function UserHeader({ user }: { user: UserDetail }) {
  return (
    <div className="flex items-center gap-8 pt-4">
      <InitialsAvatar
        name={user.nom}
        logoUrl={user.logoUrl}
        className="size-48 rounded-[14px] text-[36px]"
      />
      <div className="flex flex-col gap-3">
        <h1 className="text-[30px] font-semibold leading-9 text-foreground">{user.nom}</h1>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Créé le {formatDateLong(user.created_at)}
        </p>
      </div>
    </div>
  );
}
