"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assignee } from "@/features/dashboard/alerts";
import type { patchIncidentAction } from "../actions";
import type { Incident } from "../lib";
import { AssigneeSelect, OriginButtons, PlannedDateInput, PriorityButtons } from "./detail-fields";

type Patch = Parameters<typeof patchIncidentAction>[0];

export function DetailMainFields({
  incident,
  assignees,
  patch,
}: {
  incident: Incident;
  assignees: readonly Assignee[];
  patch: (partial: Patch) => void;
}) {
  return (
    <>
      <Field label="Priorité">
        <PriorityButtons
          value={incident.priority}
          onChange={(priority) => patch({ incidentId: incident.id, priority })}
        />
      </Field>
      <Field label="Responsable">
        <AssigneeSelect
          value={incident.assigneeId}
          assignees={assignees}
          onChange={(assigneeId) => patch({ incidentId: incident.id, assigneeId })}
        />
      </Field>
      <Field label="Origine">
        <OriginButtons
          value={incident.origin}
          onChange={(origin) => patch({ incidentId: incident.id, origin })}
        />
      </Field>
      <Field label="Mode d'intervention">
        <Select
          value={incident.intervention ?? "none"}
          onValueChange={(v) =>
            patch({
              incidentId: incident.id,
              intervention: v === "none" ? null : (v as "distance" | "surplace"),
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Non défini" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Non défini</SelectItem>
            <SelectItem value="distance">À distance</SelectItem>
            <SelectItem value="surplace">Sur place</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Date d'intervention prévue">
        <PlannedDateInput
          value={incident.plannedAt}
          onChange={(plannedAt) => patch({ incidentId: incident.id, plannedAt })}
        />
      </Field>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
