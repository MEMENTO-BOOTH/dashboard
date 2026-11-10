"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useId, useMemo, useState } from "react";
import type { BoardData } from "../hooks/types";
import {
  filterIncidents,
  hasActiveFilters,
  useIncidentFilters,
} from "../hooks/use-incident-filters";
import { useIncidentsBoard } from "../hooks/use-incidents-board";
import { columnByRole, indexColumns } from "../lib";
import { AssigneeNeededDialog } from "./assignee-needed-dialog";
import { BoardFilters } from "./board-filters";
import { BoardHeader } from "./board-header";
import { IncidentColumn } from "./incident-column";
import { IncidentDetailSheet } from "./incident-detail-sheet";
import { NewIncidentDialog } from "./new-incident-dialog";
import { OriginNeededDialog } from "./origin-needed-dialog";
import { SettingsDialog } from "./settings-dialog";

export function IncidentsBoard(data: BoardData) {
  const board = useIncidentsBoard(data);
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  const { filters, setFilters } = useIncidentFilters();
  const [newOpen, setNewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const columnsById = useMemo(() => indexColumns(data.columns), [data.columns]);
  const bornesById = useMemo(() => new Map(data.bornes.map((b) => [b.id, b])), [data.bornes]);
  const assigneeById = useMemo(
    () => new Map(data.assignees.map((a) => [a.id, { nom: a.nom, logoUrl: a.logo_url }])),
    [data.assignees],
  );
  const borneLabel = useCallback(
    (borneId: string) => {
      const b = bornesById.get(borneId);
      return b ? `${b.code} ${b.nomLieu} ${b.ville}` : "";
    },
    [bornesById],
  );

  const visible = useMemo(
    () =>
      filterIncidents(board.incidents, filters, {
        currentUserId: data.currentUserId,
        borneLabel,
        columnsById,
        settings: data.settings,
      }),
    [board.incidents, filters, borneLabel, data.currentUserId, columnsById, data.settings],
  );
  const filtering = hasActiveFilters(filters);
  const entreeName = columnByRole(data.columns, "entree")?.name ?? "À traiter";

  function handleDragEnd(event: DragEndEvent) {
    const incidentId = event.active.id as string;
    const toColumnId = event.over?.id as string | undefined;
    if (!toColumnId) return;
    board.move(incidentId, toColumnId);
  }

  const selected = board.selectedId ? board.incidents.find((i) => i.id === board.selectedId) : null;

  return (
    <div className="flex h-full flex-col gap-4">
      <BoardHeader
        incidents={board.incidents}
        columns={data.columns}
        canManage={data.canManage}
        canSettings={data.canSettings}
        onFilterP1={() => setFilters({ priority: filters.priority[0] === 1 ? [] : [1] })}
        onFilterUnassigned={() =>
          setFilters({ assignee: filters.assignee === "none" ? "" : "none" })
        }
        onNewIncident={() => setNewOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <BoardFilters
        filters={filters}
        setFilters={setFilters}
        bornes={data.bornes}
        assignees={data.assignees}
      />
      <DndContext id={dndId} sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
          {data.columns
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((column) => (
              <IncidentColumn
                key={column.id}
                column={column}
                incidents={visible.filter((i) => i.columnId === column.id)}
                total={board.incidents.filter((i) => i.columnId === column.id).length}
                filtering={filtering}
                allIncidents={board.incidents}
                columnsById={columnsById}
                bornesById={bornesById}
                assigneeById={assigneeById}
                noteCounts={data.noteCounts}
                settings={data.settings}
                onOpen={board.setSelectedId}
              />
            ))}
        </div>
      </DndContext>

      {selected && (
        <IncidentDetailSheet
          incident={selected}
          columns={data.columns}
          bornesById={bornesById}
          assignees={data.assignees}
          allIncidents={board.incidents}
          columnsById={columnsById}
          settings={data.settings}
          signalRules={data.signalRules}
          currentUserId={data.currentUserId}
          canManage={data.canManage}
          onClose={() => board.setSelectedId(null)}
          onMove={board.move}
          onSelectIncident={board.setSelectedId}
        />
      )}

      <AssigneeNeededDialog
        open={board.pendingMove?.need === "assignee"}
        assignees={data.assignees}
        currentUserId={data.currentUserId}
        entreeName={entreeName}
        onCancel={() => board.setPendingMove(null)}
        onConfirm={(assigneeId) => board.resolvePendingMove({ assigneeId })}
      />
      <OriginNeededDialog
        open={board.pendingMove?.need === "origin"}
        onCancel={() => board.setPendingMove(null)}
        onConfirm={(origin) => board.resolvePendingMove({ origin })}
      />
      <NewIncidentDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        bornes={data.bornes}
        assignees={data.assignees}
        currentUserId={data.currentUserId}
        entreeName={entreeName}
      />
      {data.canSettings && (
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          columns={data.columns}
          incidents={board.incidents}
          settings={data.settings}
          signalRules={data.signalRules}
          ignoredSignals={data.ignoredSignals}
          bornes={data.bornes}
        />
      )}
    </div>
  );
}
