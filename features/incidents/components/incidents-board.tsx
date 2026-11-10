"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useCallback, useMemo, useState } from "react";
import type { BoardData } from "../hooks/types";
import { filterIncidents, useIncidentFilters } from "../hooks/use-incident-filters";
import { useIncidentsBoard } from "../hooks/use-incidents-board";
import { indexColumns } from "../lib";
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
  const { filters, setFilters } = useIncidentFilters();
  const [newOpen, setNewOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const columnsById = useMemo(() => indexColumns(data.columns), [data.columns]);
  const bornesById = useMemo(() => new Map(data.bornes.map((b) => [b.id, b])), [data.bornes]);
  const assigneeNameById = useMemo(
    () => new Map(data.assignees.map((a) => [a.id, a.nom])),
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
    () => filterIncidents(board.incidents, filters, borneLabel),
    [board.incidents, filters, borneLabel],
  );

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
        onNewIncident={() => setNewOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <BoardFilters
        filters={filters}
        setFilters={setFilters}
        bornes={data.bornes}
        assignees={data.assignees}
      />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-1 gap-3 overflow-x-auto pb-2">
          {data.columns
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((column) => (
              <IncidentColumn
                key={column.id}
                column={column}
                incidents={visible.filter((i) => i.columnId === column.id)}
                allIncidents={board.incidents}
                columnsById={columnsById}
                bornesById={bornesById}
                assigneeNameById={assigneeNameById}
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
          canManage={data.canManage}
          onClose={() => board.setSelectedId(null)}
          onMove={board.move}
        />
      )}

      <AssigneeNeededDialog
        open={board.pendingMove?.need === "assignee"}
        assignees={data.assignees}
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
      />
      {data.canSettings && (
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          columns={data.columns}
          settings={data.settings}
          signalRules={data.signalRules}
        />
      )}
    </div>
  );
}
