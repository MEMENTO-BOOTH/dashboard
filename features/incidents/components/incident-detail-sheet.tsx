"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetRoot,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Assignee } from "@/features/dashboard/alerts";
import {
  getIncidentDetailAction,
  markFalseAlarmAction,
  patchIncidentAction,
  reopenIncidentAction,
} from "../actions";
import type { IncidentBorne } from "../api";
import { type Column, columnByRole, type Incident } from "../lib";
import { DetailMainFields } from "./detail-main-fields";
import { DetailRelatedBlock, DetailSignalBlock } from "./detail-related";
import { DetailTimeline, type TimelineEvent } from "./detail-timeline";
import { FalseAlarmDialog } from "./false-alarm-dialog";
import { PriorityPill } from "./priority-pill";

export function IncidentDetailSheet({
  incident,
  columns,
  bornesById,
  assignees,
  canManage,
  onClose,
  onMove,
}: {
  incident: Incident;
  columns: readonly Column[];
  bornesById: ReadonlyMap<string, IncidentBorne>;
  assignees: readonly Assignee[];
  canManage: boolean;
  onClose: () => void;
  onMove: (incidentId: string, toColumnId: string) => void;
}) {
  const router = useRouter();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [related, setRelated] = useState<Incident[]>([]);
  const [falseAlarmOpen, setFalseAlarmOpen] = useState(false);
  const [, startTransition] = useTransition();
  const assigneeNameById = new Map(assignees.map((a) => [a.id, a.nom]));
  const column = columns.find((c) => c.id === incident.columnId);
  const isClosed = column?.role === "cloture" || column?.role === "rejete";

  const loadDetail = () => {
    startTransition(async () => {
      const detail = await getIncidentDetailAction(incident.id, incident.borneId);
      setEvents(detail.events);
      setRelated(detail.related);
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: on recharge uniquement quand l'incident sélectionné change
  useEffect(() => {
    loadDetail();
  }, [incident.id]);

  function patch(partial: Parameters<typeof patchIncidentAction>[0]) {
    startTransition(async () => {
      try {
        await patchIncidentAction(partial);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Modification impossible.");
      }
    });
  }

  function observe() {
    const obsColumn = columnByRole(columns, "observation");
    if (obsColumn) onMove(incident.id, obsColumn.id);
  }
  function close() {
    const closeColumn = columnByRole(columns, "cloture");
    if (closeColumn) onMove(incident.id, closeColumn.id);
  }
  async function reopen() {
    await reopenIncidentAction({ incidentId: incident.id });
    router.refresh();
  }
  async function confirmFalseAlarm(options: { ignoreSignal: boolean; reason: string }) {
    await markFalseAlarmAction({ incidentId: incident.id, ...options });
    setFalseAlarmOpen(false);
    onClose();
    router.refresh();
  }

  return (
    <SheetRoot open onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PriorityPill priority={incident.priority} />
              <SheetTitle className="text-base font-semibold">
                #{incident.number} · {incident.title}
              </SheetTitle>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="sm">
                Fermer
              </Button>
            </SheetClose>
          </div>
          <p className="text-xs text-muted-foreground">{column?.name}</p>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-5">
          <DetailMainFields incident={incident} assignees={assignees} patch={patch} />
          <DetailSignalBlock incident={incident} />
          <DetailRelatedBlock borne={bornesById.get(incident.borneId)} related={related} />
          <DetailTimeline
            incidentId={incident.id}
            events={events}
            authorName={(id) => assigneeNameById.get(id) ?? "un membre de l'équipe"}
            canManage={canManage}
            onNoteAdded={loadDetail}
          />
        </SheetBody>

        {canManage && (
          <SheetFooter>
            {isClosed ? (
              <Button variant="outline" onClick={reopen}>
                Rouvrir
              </Button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setFalseAlarmOpen(true)}>
                  Fausse alerte
                </Button>
                <Button variant="outline" onClick={observe}>
                  Surveiller 7j
                </Button>
                <Button onClick={close}>Clôturer</Button>
              </div>
            )}
          </SheetFooter>
        )}
      </SheetContent>

      <FalseAlarmDialog
        open={falseAlarmOpen}
        hasSignal={Boolean(incident.signalType)}
        onCancel={() => setFalseAlarmOpen(false)}
        onConfirm={confirmFalseAlarm}
      />
    </SheetRoot>
  );
}
