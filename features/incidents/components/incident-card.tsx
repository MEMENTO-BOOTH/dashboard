"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Clock, MapPin, MessageSquare, MonitorSmartphone, User } from "lucide-react";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { cn } from "@/lib/utils/cn";
import type { IncidentBorne } from "../api";
import { type Column, formatDurationFr, type Incident, isStale, type Settings } from "../lib";
import { IncidentBadges } from "./incident-badges";
import { IncidentSourceIcon } from "./incident-source-icon";
import { PriorityPill } from "./priority-pill";
import { StatusBanners } from "./status-banner";

export function IncidentCard({
  incident,
  column,
  borne,
  assignee,
  notesCount,
  allIncidents,
  columnsById,
  settings,
  onOpen,
}: {
  incident: Incident;
  column: Column;
  borne: IncidentBorne | undefined;
  assignee: { nom: string; logoUrl: string | null } | undefined;
  notesCount: number;
  allIncidents: readonly Incident[];
  columnsById: ReadonlyMap<string, Column>;
  settings: Settings;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: incident.id,
  });
  const now = new Date();
  const stale = isStale(incident, column, now, settings);
  const place = borne ? [borne.code, borne.nomLieu, borne.ville].filter(Boolean).join(" · ") : "";

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onOpen}
      style={transform ? { transform: CSS.Translate.toString(transform) } : undefined}
      className={cn(
        "flex w-full flex-col gap-3 rounded-[14px] border border-border bg-card p-4 text-left shadow-sm transition-[box-shadow,opacity] hover:shadow-md",
        stale && "border-warning",
        isDragging && "z-10 opacity-50",
      )}
    >
      <div className="flex items-start gap-3">
        <IncidentSourceIcon incident={incident} size={36} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-[14px] font-medium leading-5 text-card-foreground">{incident.title}</p>
          {place && (
            <p className="truncate text-[13px] font-normal leading-5 text-muted-foreground">
              {place}
            </p>
          )}
        </div>
        <PriorityPill priority={incident.priority} />
      </div>

      <IncidentBadges
        incident={incident}
        allIncidents={allIncidents}
        columnsById={columnsById}
        settings={settings}
      />

      <StatusBanners incident={incident} column={column} settings={settings} now={now} />

      <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-[13px] leading-5 text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          {assignee ? (
            <>
              <InitialsAvatar
                name={assignee.nom}
                logoUrl={assignee.logoUrl}
                className="size-6 rounded-full text-[10px]"
              />
              <span className="truncate text-card-foreground">{assignee.nom}</span>
            </>
          ) : (
            <>
              <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-border">
                <User className="size-3.5" />
              </span>
              <span>Sans responsable</span>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {incident.intervention === "surplace" && (
            <MapPin className="size-4" aria-label="Intervention sur place" />
          )}
          {incident.intervention === "distance" && (
            <MonitorSmartphone className="size-4" aria-label="Intervention à distance" />
          )}
          {notesCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="size-4" />
              {notesCount}
            </span>
          )}
          <span className="flex items-center gap-1" title="Dans cette colonne depuis">
            <Clock className="size-4" />
            {formatDurationFr(now.getTime() - incident.movedAt.getTime())}
          </span>
        </div>
      </div>
    </button>
  );
}
