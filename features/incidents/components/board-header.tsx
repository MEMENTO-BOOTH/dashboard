"use client";

import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import type { Column, Incident } from "../lib";
import { summarize } from "../lib";

export function BoardHeader({
  incidents,
  columns,
  canManage,
  canSettings,
  onNewIncident,
  onOpenSettings,
}: {
  incidents: Incident[];
  columns: Column[];
  canManage: boolean;
  canSettings: boolean;
  onNewIncident: () => void;
  onOpenSettings: () => void;
}) {
  const summary = summarize(incidents, columns, new Date());

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="mr-2 text-xl font-semibold text-foreground">Incidents</h1>
        <Pill label="Ouverts" value={summary.openCount} />
        <Pill
          label="P1"
          value={summary.p1Open}
          tone={summary.p1Open > 0 ? "destructive" : undefined}
        />
        <Pill
          label="Bornes HS"
          value={summary.bornesDown}
          tone={summary.bornesDown > 0 ? "destructive" : undefined}
        />
        <Pill label="Non attribués" value={summary.unassigned} />
        <Pill label="Prêts à clôturer" value={summary.readyToClose} />
      </div>
      <div className="flex items-center gap-2">
        {canSettings && (
          <IconButton variant="outline" onClick={onOpenSettings} aria-label="Paramètres">
            <Settings className="size-4" />
          </IconButton>
        )}
        {canManage && (
          <Button onClick={onNewIncident}>
            <Plus className="size-4" />
            Nouvel incident
          </Button>
        )}
      </div>
    </div>
  );
}

function Pill({ label, value, tone }: { label: string; value: number; tone?: "destructive" }) {
  return (
    <span
      className={
        tone === "destructive"
          ? "inline-flex h-6 items-center gap-1 rounded-4xl bg-destructive/10 px-2.5 text-xs font-medium text-destructive"
          : "inline-flex h-6 items-center gap-1 rounded-4xl bg-muted px-2.5 text-xs font-medium text-muted-foreground"
      }
    >
      {label} <span className="font-semibold">{value}</span>
    </span>
  );
}
