"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { moveIncidentAction, patchIncidentAction } from "../actions";
import type { Incident } from "../lib";
import type { BoardData, PendingMove } from "./types";

export function useIncidentsBoard(data: BoardData) {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>(data.incidents);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [isPending, startTransition] = useTransition();

  function patchLocal(incident: Incident) {
    setIncidents((prev) => prev.map((i) => (i.id === incident.id ? incident : i)));
  }

  function move(incidentId: string, toColumnId: string) {
    const incident = incidents.find((i) => i.id === incidentId);
    if (!incident || incident.columnId === toColumnId) return;
    const previousColumnId = incident.columnId;
    patchLocal({ ...incident, columnId: toColumnId });

    startTransition(async () => {
      try {
        const result = await moveIncidentAction({ incidentId, toColumnId });
        if (result.ok) {
          router.refresh();
          return;
        }
        patchLocal({ ...incident, columnId: previousColumnId });
        setPendingMove({ incidentId, toColumnId, need: result.need });
      } catch (err) {
        patchLocal({ ...incident, columnId: previousColumnId });
        toast.error(err instanceof Error ? err.message : "Impossible de déplacer l'incident.");
      }
    });
  }

  function resolvePendingMove(value: { assigneeId?: string; origin?: Incident["origin"] }) {
    const pending = pendingMove;
    if (!pending) return;
    setPendingMove(null);
    startTransition(async () => {
      try {
        await patchIncidentAction({ incidentId: pending.incidentId, ...value });
        const result = await moveIncidentAction({
          incidentId: pending.incidentId,
          toColumnId: pending.toColumnId,
        });
        if (result.ok) {
          const incident = incidents.find((i) => i.id === pending.incidentId);
          if (incident) patchLocal({ ...incident, columnId: pending.toColumnId });
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Impossible de déplacer l'incident.");
      }
    });
  }

  return {
    incidents,
    setIncidents,
    selectedId,
    setSelectedId,
    pendingMove,
    setPendingMove,
    move,
    resolvePendingMove,
    isPending,
    router,
  };
}
