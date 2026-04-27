import { ChevronRight, Replace, Siren } from "lucide-react";
import type { InterventionMode } from "../intervention-types";

// Step 1 du flow intervention — choix du mode

export function ModeChoice({
  onSelect,
  alerteCount,
}: {
  onSelect: (m: InterventionMode) => void;
  alerteCount: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ChoiceRow
        icon={<Siren className="size-6 text-destructive" strokeWidth={1.75} />}
        iconBg="bg-destructive/10"
        title="Dépannage"
        subtitle="Résoudre une alerte active"
        hint={`${alerteCount} borne${alerteCount > 1 ? "s" : ""} concernée${alerteCount > 1 ? "s" : ""}`}
        onClick={() => onSelect("alerte")}
      />
      <ChoiceRow
        icon={<Replace className="size-6 text-info" strokeWidth={1.75} />}
        iconBg="bg-info/10"
        title="Remplacement matériel"
        subtitle="Planifier une visite de maintenance"
        hint="Caméra, imprimante, TPE, écran, câble"
        onClick={() => onSelect("maintenance")}
      />
    </div>
  );
}

function ChoiceRow({
  icon,
  iconBg,
  title,
  subtitle,
  hint,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-[12px] border border-border bg-card p-5 text-left transition-all hover:border-primary/40 hover:bg-accent"
    >
      <div className={`flex size-14 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[16px] font-semibold leading-6 text-foreground">{title}</p>
        <p className="text-[13px] font-normal leading-5 text-muted-foreground">{subtitle}</p>
        <p className="mt-1 truncate text-[12px] font-medium leading-4 text-muted-foreground">
          · {hint}
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
    </button>
  );
}
