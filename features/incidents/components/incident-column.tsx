"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils/cn";
import type { IncidentBorne } from "../api";
import { type Column, compareIncidents, type Incident, type Settings } from "../lib";
import { IncidentCard } from "./incident-card";

export function IncidentColumn({
  column,
  incidents,
  allIncidents,
  columnsById,
  bornesById,
  assigneeNameById,
  settings,
  onOpen,
}: {
  column: Column;
  incidents: Incident[];
  allIncidents: readonly Incident[];
  columnsById: ReadonlyMap<string, Column>;
  bornesById: ReadonlyMap<string, IncidentBorne>;
  assigneeNameById: ReadonlyMap<string, string>;
  settings: Settings;
  onOpen: (incidentId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const sorted = [...incidents].sort(compareIncidents);

  return (
    <div className="flex w-72 shrink-0 flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-foreground">{column.name}</h3>
        <span className="text-xs text-muted-foreground">{sorted.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-1 flex-col gap-2 rounded-[8px] bg-muted/40 p-2 transition-colors",
          isOver && "bg-muted",
        )}
      >
        {sorted.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            column={column}
            borne={bornesById.get(incident.borneId)}
            assigneeName={
              incident.assigneeId ? assigneeNameById.get(incident.assigneeId) : undefined
            }
            allIncidents={allIncidents}
            columnsById={columnsById}
            settings={settings}
            onOpen={() => onOpen(incident.id)}
          />
        ))}
        {sorted.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">Aucun incident</p>
        )}
      </div>
    </div>
  );
}
