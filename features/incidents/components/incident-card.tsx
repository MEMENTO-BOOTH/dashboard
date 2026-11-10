"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Radio, User } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { cn } from "@/lib/utils/cn";
import type { IncidentBorne } from "../api";
import { type Column, type Incident, isRecurrent, type Settings, seriesSize } from "../lib";
import { PriorityPill } from "./priority-pill";
import { StatusBanner } from "./status-banner";

export function IncidentCard({
  incident,
  column,
  borne,
  assigneeName,
  allIncidents,
  columnsById,
  settings,
  onOpen,
}: {
  incident: Incident;
  column: Column;
  borne: IncidentBorne | undefined;
  assigneeName: string | undefined;
  allIncidents: readonly Incident[];
  columnsById: ReadonlyMap<string, Column>;
  settings: Settings;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: incident.id,
  });
  const now = new Date();
  const series = seriesSize(incident, allIncidents, columnsById);
  const recurrent = isRecurrent(incident, settings);

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onOpen}
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      className={cn(
        "flex w-full flex-col gap-2 rounded-[8px] border border-input bg-background p-3 text-left shadow-xs transition-opacity",
        isDragging && "z-10 opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <PriorityPill priority={incident.priority} />
          <span className="text-sm font-medium text-foreground">{incident.title}</span>
        </div>
        {incident.occurrences > 1 && (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            ×{incident.occurrences}
          </span>
        )}
      </div>

      {borne && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          <span>
            {borne.code} · {borne.nomLieu} · {borne.ville}
          </span>
        </div>
      )}

      {(incident.returned || recurrent || series > 0 || incident.solution === "provisoire") && (
        <div className="flex flex-wrap gap-1">
          {incident.returned && <MiniBadge>Revenu</MiniBadge>}
          {recurrent && (
            <MiniBadge>
              Récurrent·{incident.episodes}×en {settings.recidiveWindowDays}j
            </MiniBadge>
          )}
          {series > 0 && <MiniBadge>Série·{series} bornes</MiniBadge>}
          {incident.solution === "provisoire" && <MiniBadge>Provisoire</MiniBadge>}
        </div>
      )}

      <StatusBanner incident={incident} column={column} settings={settings} now={now} />

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {assigneeName ? (
            <InitialsAvatar name={assigneeName} className="size-5 rounded-full text-[10px]" />
          ) : (
            <User className="size-3.5 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          {incident.source === "auto" && <Radio className="size-3.5" />}
        </div>
      </div>
    </button>
  );
}

function MiniBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-4.5 items-center rounded-4xl bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
