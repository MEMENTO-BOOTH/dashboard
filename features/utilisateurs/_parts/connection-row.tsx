import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import type { Connection } from "../schemas";

export function ConnectionRow({ c }: { c: Connection }) {
  return (
    <Link
      href={`/parc/bornes/${c.borne_id}`}
      className="grid h-14 grid-cols-[1fr_160px_40px] items-center border-t border-border px-6 transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <InitialsAvatar
          name={c.borne_nom}
          logoUrl={c.borne_logo}
          className="size-9 rounded-full text-[13px]"
        />
        <p className="truncate text-[14px] font-medium leading-5 text-foreground">{c.borne_nom}</p>
      </div>
      <span className="text-[14px] leading-5 text-muted-foreground">{c.last_seen}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}
