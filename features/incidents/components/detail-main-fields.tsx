"use client";

import type { Assignee } from "@/features/dashboard/alerts";
import type { patchIncidentAction } from "../actions";
import { type Column, type Incident, PRIORITIES } from "../lib";
import { AssigneeSelect, ColumnSelect, PlannedDateInput } from "./detail-fields";
import {
  InterventionButtons,
  OriginButtons,
  PriorityButtons,
  SolutionButtons,
} from "./detail-segmented";

type Patch = Parameters<typeof patchIncidentAction>[0];

export function DetailMainFields({
  incident,
  columns,
  assignees,
  currentUserId,
  canManage,
  patch,
  onMove,
}: {
  incident: Incident;
  columns: readonly Column[];
  assignees: readonly Assignee[];
  currentUserId: string;
  canManage: boolean;
  patch: (partial: Patch) => void;
  onMove: (incidentId: string, toColumnId: string) => void;
}) {
  const id = incident.id;
  const ro = !canManage;
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      <Field label="Colonne">
        <ColumnSelect
          value={incident.columnId}
          columns={columns}
          onChange={(columnId) => onMove(id, columnId)}
          disabled={ro}
        />
      </Field>
      <Field label="Responsable">
        <AssigneeSelect
          value={incident.assigneeId}
          assignees={assignees}
          currentUserId={currentUserId}
          onChange={(assigneeId) => patch({ incidentId: id, assigneeId })}
          disabled={ro}
        />
      </Field>
      <Field label="Priorité" full>
        <PriorityButtons
          value={incident.priority}
          onChange={(priority) => patch({ incidentId: id, priority })}
          disabled={ro}
        />
        <Hint>
          <b className="font-medium text-foreground">
            P{incident.priority} · {PRIORITIES[incident.priority].name}.
          </b>{" "}
          {PRIORITIES[incident.priority].definition}
        </Hint>
      </Field>
      <Field label="Origine de la panne" full>
        <OriginButtons
          value={incident.origin}
          onChange={(origin) => patch({ incidentId: id, origin })}
          disabled={ro}
        />
        <Hint>
          Obligatoire pour clôturer. Reste sur « À diagnostiquer » tant que la cause n'est pas sûre.
        </Hint>
      </Field>
      <Field label="Intervention">
        <InterventionButtons
          value={incident.intervention}
          onChange={(intervention) => patch({ incidentId: id, intervention })}
          disabled={ro}
        />
      </Field>
      <Field label="Solution">
        <SolutionButtons
          value={incident.solution}
          onChange={(solution) => patch({ incidentId: id, solution })}
          disabled={ro}
        />
      </Field>
      <Field label="Intervention prévue le">
        <PlannedDateInput
          value={incident.plannedAt}
          onChange={(plannedAt) => patch({ incidentId: id, plannedAt })}
          disabled={ro}
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "col-span-2 flex flex-col gap-2" : "flex min-w-0 flex-col gap-2"}>
      <p className="text-[14px] leading-5 text-foreground">{label}</p>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-5 text-muted-foreground">{children}</p>;
}
