"use client";

import { useDroppable } from "@dnd-kit/core";
import { Archive } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { IncidentBorne } from "../api";
import {
  type Column,
  compareIncidents,
  type Incident,
  isArchived,
  observationDaysOf,
  type Settings,
} from "../lib";
import { IncidentCard } from "./incident-card";

const ROLE_TAGS: Record<Column["role"], (c: Column) => string | null> = {
  entree: () => "Entrée",
  libre: () => null,
  observation: (c) => `Observation · ${observationDaysOf(c)} j`,
  cloture: () => "Clôture",
  rejete: () => "Rejet",
};

export type AssigneeInfo = { nom: string; logoUrl: string | null };

export function IncidentColumn({
  column,
  incidents,
  total,
  filtering,
  allIncidents,
  columnsById,
  bornesById,
  assigneeById,
  noteCounts,
  settings,
  onOpen,
}: {
  column: Column;
  incidents: Incident[];
  total: number;
  filtering: boolean;
  allIncidents: readonly Incident[];
  columnsById: ReadonlyMap<string, Column>;
  bornesById: ReadonlyMap<string, IncidentBorne>;
  assigneeById: ReadonlyMap<string, AssigneeInfo>;
  noteCounts: Record<string, number>;
  settings: Settings;
  onOpen: (incidentId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [showArchive, setShowArchive] = useState(false);
  const now = new Date();

  const archivedCount =
    column.role === "cloture"
      ? incidents.filter((i) => isArchived(i, column, now, settings)).length
      : 0;
  const shown =
    column.role === "cloture" && !showArchive
      ? incidents.filter((i) => !isArchived(i, column, now, settings))
      : incidents;
  const sorted = [...shown].sort(compareIncidents);
  const roleTag = ROLE_TAGS[column.role](column);

  return (
    <div className="flex h-full min-h-0 w-[300px] shrink-0 flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <h3 className="truncate text-[16px] font-semibold leading-6 text-foreground">
          {column.name}
        </h3>
        <Badge variant="secondary" className="tabular-nums">
          {filtering ? `${sorted.length}/${total}` : total}
        </Badge>
        {roleTag && (
          <span className="ml-auto shrink-0 text-[13px] leading-5 text-muted-foreground">
            {roleTag}
          </span>
        )}
      </div>
      <div
        ref={setNodeRef}
        data-slot="column-drop"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-[14px] bg-muted/50 p-3 transition-colors",
          isOver && "bg-muted ring-2 ring-primary/20",
        )}
      >
        {sorted.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            column={column}
            borne={bornesById.get(incident.borneId)}
            assignee={incident.assigneeId ? assigneeById.get(incident.assigneeId) : undefined}
            notesCount={noteCounts[incident.id] ?? 0}
            allIncidents={allIncidents}
            columnsById={columnsById}
            settings={settings}
            onOpen={() => onOpen(incident.id)}
          />
        ))}
        {sorted.length === 0 && (
          <p className="rounded-[10px] border border-dashed border-border px-3 py-6 text-center text-[13px] leading-5 text-muted-foreground">
            {filtering && total > 0
              ? "Aucun incident ne correspond aux filtres."
              : column.role === "entree"
                ? "Rien à traiter. Les nouveaux incidents arrivent ici."
                : "Glisse un incident ici."}
          </p>
        )}
      </div>
      {archivedCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start text-muted-foreground"
          onClick={() => setShowArchive((v) => !v)}
          iconStart={<Archive />}
        >
          {showArchive ? "Masquer l'archive" : `Voir l'archive (${archivedCount})`}
        </Button>
      )}
    </div>
  );
}
