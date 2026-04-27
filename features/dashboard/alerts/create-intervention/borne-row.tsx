import { Check } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { AlertBadge } from "../alert-badge";
import { alertLabelFor } from "../icons";
import type { BorneIssue, BorneSummary, InterventionCandidate } from "../intervention-types";

const TOTAL_SHEETS = 400;

function badgeTypeFor(issue: BorneIssue): string {
  return issue.kind === "alerte" ? issue.type : "papier_bas";
}

export function BorneRow({
  candidate,
  selected,
  onToggle,
}: {
  candidate: InterventionCandidate;
  selected: boolean;
  onToggle: () => void;
}) {
  const labels = candidate.issues.map((i) =>
    i.kind === "alerte" ? alertLabelFor(i.type) : `Papier ${i.sheets}/${TOTAL_SHEETS}`,
  );
  const firstIssue = candidate.issues[0];
  const badgeType = firstIssue ? badgeTypeFor(firstIssue) : null;

  return (
    <RowButton
      selected={selected}
      onToggle={onToggle}
      name={candidate.nom_lieu}
      logoUrl={candidate.logo_url}
      subtitle={labels.join(" · ")}
      badgeType={badgeType}
    />
  );
}

export function BorneSimpleRow({
  borne,
  selected,
  onToggle,
}: {
  borne: BorneSummary;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <RowButton
      selected={selected}
      onToggle={onToggle}
      name={borne.nom_lieu}
      logoUrl={borne.logo_url}
      badgeType={null}
    />
  );
}

function RowButton({
  selected,
  onToggle,
  name,
  logoUrl,
  subtitle,
  badgeType,
}: {
  selected: boolean;
  onToggle: () => void;
  name: string;
  logoUrl: string | null;
  subtitle?: string;
  badgeType: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`flex w-full items-center gap-4 rounded-[10px] border bg-card px-5 py-4 text-left transition-colors ${
        selected ? "border-foreground" : "border-border hover:border-foreground/30"
      }`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-colors ${
          selected ? "border-foreground bg-foreground text-background" : "border-input"
        }`}
      >
        {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      {badgeType ? (
        <AlertBadge type={badgeType} size={44} />
      ) : (
        <InitialsAvatar
          name={name}
          logoUrl={logoUrl}
          className="size-11 shrink-0 rounded-full text-[14px]"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-[15px] font-semibold leading-6 text-foreground">{name}</p>
        {subtitle ? (
          <p className="truncate text-[13px] font-normal leading-5 text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </button>
  );
}
