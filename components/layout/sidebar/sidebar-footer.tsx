import { LogOut } from "lucide-react";
import { signOutAction } from "@/features/auth";

export type SidebarFooterProps = {
  name: string;
  role: string;
  avatarUrl: string | null;
};

export function SidebarFooter({ name, role, avatarUrl }: SidebarFooterProps) {
  return (
    <div className="absolute -bottom-px -left-px -right-px flex h-[68px] flex-col items-center gap-0 rounded-[6px] bg-background p-2">
      <div className="flex w-full items-center gap-2 rounded-[6px] p-2 group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:p-1">
        <div className="relative flex size-8 shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-muted text-[13px] font-semibold text-foreground">
          {avatarUrl ? (
            // biome-ignore lint/performance/noImgElement: user avatar
            <img
              src={avatarUrl}
              alt={name}
              className="pointer-events-none absolute inset-0 size-full object-cover"
            />
          ) : (
            getInitials(name)
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start text-left text-sidebar-foreground group-data-[collapsed]/sidebar:hidden">
          <p className="w-full truncate text-[14px] font-medium leading-5">{name}</p>
          <p className="w-full truncate text-[12px] font-light leading-4">{role}</p>
        </div>
        <form action={signOutAction} className="group-data-[collapsed]/sidebar:hidden">
          <button
            type="submit"
            aria-label="Déconnexion"
            title="Déconnexion"
            className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}
