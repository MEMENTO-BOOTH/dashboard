import { Check } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import type { Assignee } from "../intervention-types";

export function AssigneeList({
  value,
  onChange,
  assignees,
}: {
  value: string;
  onChange: (id: string) => void;
  assignees: Assignee[];
}) {
  if (assignees.length === 0) {
    return (
      <p className="rounded-[10px] border border-dashed border-border bg-muted/30 px-4 py-3 text-[13px] leading-5 text-muted-foreground">
        Aucun utilisateur actif.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {assignees.map((a) => {
        const sel = value === a.id;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onChange(a.id)}
            aria-pressed={sel}
            className={`flex items-center gap-3 rounded-[10px] border bg-card px-4 py-3 text-left transition-colors ${
              sel ? "border-foreground" : "border-border hover:border-foreground/30"
            }`}
          >
            <InitialsAvatar
              name={a.nom}
              logoUrl={a.logo_url}
              className="size-10 shrink-0 rounded-full text-[13px]"
            />
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-5 text-foreground">
              {a.nom}
            </span>
            {sel ? <Check className="size-4 shrink-0 text-foreground" strokeWidth={2.5} /> : null}
          </button>
        );
      })}
    </div>
  );
}
