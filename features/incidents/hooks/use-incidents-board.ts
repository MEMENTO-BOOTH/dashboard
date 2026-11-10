"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { type MoveActionResult, moveIncidentAction, patchIncidentAction } from "../actions";
import type { Incident } from "../lib";
import type { BoardData, PendingMove } from "./types";

export function useIncidentsBoard(data: BoardData) {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>(data.incidents);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIncidents(data.incidents);
  }, [data.incidents]);

  function patchLocal(incident: Incident) {
    setIncidents((prev) => prev.map((i) => (i.id === incident.id ? incident : i)));
  }

  /** Le serveur a refusé : on remet la carte, on prévient, et on resynchronise le tableau. */
  function failMove(incident: Incident | undefined, previousColumnId: string, message: string) {
    if (incident) patchLocal({ ...incident, columnId: previousColumnId });
    toast.error(message);
    setSelectedId(null);
    router.refresh();
  }

  function move(incidentId: string, toColumnId: string) {
    const incident = incidents.find((i) => i.id === incidentId);
    if (!incident || incident.columnId === toColumnId) return;
    const previousColumnId = incident.columnId;
    patchLocal({ ...incident, columnId: toColumnId });

    startTransition(async () => {
      let result: MoveActionResult;
      try {
        result = await moveIncidentAction({ incidentId, toColumnId });
      } catch (err) {
        failMove(incident, previousColumnId, errorMessage(err));
        return;
      }
      if (result.ok) {
        router.refresh();
        return;
      }
      if ("error" in result) {
        failMove(incident, previousColumnId, result.error);
        return;
      }
      patchLocal({ ...incident, columnId: previousColumnId });
      setPendingMove({ incidentId, toColumnId, need: result.need });
    });
  }

  function resolvePendingMove(value: { assigneeId?: string; origin?: Incident["origin"] }) {
    const pending = pendingMove;
    if (!pending) return;
    setPendingMove(null);
    const incident = incidents.find((i) => i.id === pending.incidentId);
    startTransition(async () => {
      try {
        await patchIncidentAction({ incidentId: pending.incidentId, ...value });
        const result = await moveIncidentAction({
          incidentId: pending.incidentId,
          toColumnId: pending.toColumnId,
        });
        if (result.ok) {
          if (incident) patchLocal({ ...incident, columnId: pending.toColumnId });
          router.refresh();
          return;
        }
        if ("error" in result) failMove(incident, incident?.columnId ?? "", result.error);
      } catch (err) {
        failMove(incident, incident?.columnId ?? "", errorMessage(err));
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

function errorMessage(err: unknown): string {
  return err instanceof Error && err.message
    ? err.message
    : "Impossible de déplacer l'incident. Le tableau va se rafraîchir.";
}
