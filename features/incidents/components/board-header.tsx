"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Column, Incident } from "../lib";
import { summarize } from "../lib";

export function BoardHeader({
  incidents,
  columns,
  canManage,
  canSettings,
  onFilterP1,
  onFilterUnassigned,
  onNewIncident,
  onOpenSettings,
}: {
  incidents: Incident[];
  columns: Column[];
  canManage: boolean;
  canSettings: boolean;
  onFilterP1: () => void;
  onFilterUnassigned: () => void;
  onNewIncident: () => void;
  onOpenSettings: () => void;
}) {
  const s = summarize(incidents, columns, new Date());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold leading-8 text-foreground">Incidents</h1>
          <p className="max-w-[62ch] text-[14px] leading-5 text-muted-foreground">
            Pannes et bugs des bornes, remontés par le dashboard ou signalés. Clique sur une carte
            pour ouvrir sa fiche, glisse-la pour changer de colonne.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canSettings && (
            <Button
              variant="outline"
              onClick={onOpenSettings}
              iconStart={<SlidersHorizontal className="size-4" />}
            >
              Paramètres
            </Button>
          )}
          {canManage && (
            <Button onClick={onNewIncident} iconStart={<Plus className="size-4" />}>
              Nouvel incident
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Stat value={s.p1Open} label="P1 ouverts" tone="bg-destructive" onClick={onFilterP1} />
        <Stat
          value={s.bornesDown}
          label={s.bornesDown > 1 ? "Bornes hors service" : "Borne hors service"}
          tone="bg-warning"
        />
        <Stat value={s.unassigned} label="Sans responsable" onClick={onFilterUnassigned} />
        <Stat
          value={s.readyToClose}
          label={s.readyToClose > 1 ? "Prêts à clôturer" : "Prêt à clôturer"}
          tone="bg-success"
        />
        <Stat value={s.openCount} label="Incidents ouverts" />
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
  onClick,
}: {
  value: number;
  label: string;
  tone?: string;
  onClick?: () => void;
}) {
  const classes = cn(
    "flex flex-col gap-1 rounded-[14px] border border-border bg-card px-5 py-4 text-left shadow-sm",
    onClick && "transition-colors hover:bg-muted/40",
  );
  const content = (
    <>
      <span className="flex items-center gap-2 text-[13px] leading-5 text-muted-foreground">
        {tone && <span className={cn("size-2 rounded-full", tone)} />}
        {label}
      </span>
      <span className="text-[24px] font-semibold leading-8 text-card-foreground tabular-nums">
        {value}
      </span>
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={classes} title={`Filtrer : ${label}`}>
      {content}
    </button>
  ) : (
    <div className={classes}>{content}</div>
  );
}
