"use client";

import { Ban, Check, Eye, RotateCcw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "radix-ui";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
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
import {
  type Column,
  columnByRole,
  type Incident,
  isFinalRole,
  observationDaysOf,
  observationStatus,
  type Settings,
  type SignalRule,
  TITLE_MAX,
} from "../lib";
import { DetailMainFields } from "./detail-main-fields";
import { DetailRelatedBlock, DetailSignalBlock } from "./detail-related";
import { DetailTimeline, type TimelineEvent } from "./detail-timeline";
import { FalseAlarmDialog } from "./false-alarm-dialog";
import { IncidentBadges } from "./incident-badges";
import { IncidentSourceIcon } from "./incident-source-icon";
import { PriorityPill } from "./priority-pill";
import { StatusBanners } from "./status-banner";

export function IncidentDetailSheet({
  incident,
  columns,
  bornesById,
  assignees,
  allIncidents,
  columnsById,
  settings,
  signalRules,
  currentUserId,
  canManage,
  onClose,
  onMove,
  onSelectIncident,
}: {
  incident: Incident;
  columns: readonly Column[];
  bornesById: ReadonlyMap<string, IncidentBorne>;
  assignees: readonly Assignee[];
  allIncidents: readonly Incident[];
  columnsById: ReadonlyMap<string, Column>;
  settings: Settings;
  signalRules: readonly SignalRule[];
  currentUserId: string;
  canManage: boolean;
  onClose: () => void;
  onMove: (incidentId: string, toColumnId: string) => void;
  onSelectIncident: (incidentId: string) => void;
}) {
  const router = useRouter();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [related, setRelated] = useState<Incident[]>([]);
  const [falseAlarmOpen, setFalseAlarmOpen] = useState(false);
  const [title, setTitle] = useState(incident.title);
  const [, startTransition] = useTransition();
  const assigneeById = new Map(assignees.map((a) => [a.id, a]));
  const column = columnsById.get(incident.columnId);
  const isClosed = column ? isFinalRole(column.role) : false;
  const borne = bornesById.get(incident.borneId);
  const now = new Date();
  const place = borne ? [borne.code, borne.nomLieu, borne.ville].filter(Boolean).join(" · ") : "";

  const loadDetail = () => {
    startTransition(async () => {
      const detail = await getIncidentDetailAction(incident.id, incident.borneId);
      setEvents(detail.events);
      setRelated(detail.related);
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: rechargement et resynchronisation du titre uniquement quand l'incident sélectionné change
  useEffect(() => {
    loadDetail();
    setTitle(incident.title);
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

  function submitTitle() {
    const trimmed = title.trim();
    if (!trimmed || trimmed === incident.title) {
      setTitle(incident.title);
      return;
    }
    patch({ incidentId: incident.id, title: trimmed });
  }

  function moveToRole(role: "observation" | "cloture") {
    const target = columnByRole(columns, role);
    if (target) onMove(incident.id, target.id);
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

  const obsColumn = columnByRole(columns, "observation");
  const ready = column ? observationStatus(incident, column, now).state === "ready" : false;

  return (
    <SheetRoot open onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        className="max-w-[560px] border-border bg-card"
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).focus();
        }}
      >
        <VisuallyHidden.Root>
          <SheetTitle>{incident.title}</SheetTitle>
          <SheetDescription>Fiche de l'incident #{incident.number}</SheetDescription>
        </VisuallyHidden.Root>
        <SheetHeader className="gap-4 border-border p-6">
          <div className="flex items-start gap-3">
            <IncidentSourceIcon incident={incident} size={38} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={submitTitle}
                maxLength={TITLE_MAX}
                aria-label="Titre de l'incident"
                disabled={!canManage}
                className="-mx-1.5 rounded-md border border-transparent bg-transparent px-1.5 text-[18px] font-semibold leading-[28px] text-card-foreground outline-none hover:border-border focus:border-ring focus:bg-background disabled:opacity-100"
              />
              <p className="truncate text-[14px] leading-5 text-muted-foreground">
                {place}
                {column ? ` · ${column.name}` : ""} · #{incident.number}
              </p>
            </div>
            <SheetClose asChild>
              <IconButton variant="ghost" size="sm" aria-label="Fermer la fiche">
                <X />
              </IconButton>
            </SheetClose>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <PriorityPill priority={incident.priority} withName />
            <IncidentBadges
              incident={incident}
              allIncidents={allIncidents}
              columnsById={columnsById}
              settings={settings}
              className="contents"
            />
          </div>
          {column && (
            <StatusBanners incident={incident} column={column} settings={settings} now={now} />
          )}
        </SheetHeader>

        <SheetBody className="flex flex-col gap-8 p-6">
          <DetailMainFields
            incident={incident}
            columns={columns}
            assignees={assignees}
            currentUserId={currentUserId}
            canManage={canManage}
            patch={patch}
            onMove={onMove}
          />
          <DetailSignalBlock
            incident={incident}
            signalRules={signalRules}
            settings={settings}
            isOpen={!isClosed}
          />
          <DetailRelatedBlock
            borne={borne}
            related={related}
            columnsById={columnsById}
            onSelect={onSelectIncident}
          />
          <DetailTimeline
            incidentId={incident.id}
            events={events}
            author={(id) => {
              const a = assigneeById.get(id);
              return a ? { nom: a.nom, logoUrl: a.logo_url } : { nom: "Équipe", logoUrl: null };
            }}
            canManage={canManage}
            onNoteAdded={loadDetail}
          />
        </SheetBody>

        {canManage && (
          <SheetFooter className="border-border p-4">
            {isClosed ? (
              <Button
                variant="outline"
                className="ml-auto"
                onClick={reopen}
                iconStart={<RotateCcw className="size-4" />}
              >
                Rouvrir
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="mr-auto text-destructive hover:text-destructive"
                  onClick={() => setFalseAlarmOpen(true)}
                  iconStart={<Ban className="size-4" />}
                >
                  Fausse alerte
                </Button>
                {obsColumn && column?.role !== "observation" && (
                  <Button
                    variant="outline"
                    onClick={() => moveToRole("observation")}
                    iconStart={<Eye className="size-4" />}
                  >
                    Surveiller {observationDaysOf(obsColumn)} j
                  </Button>
                )}
                <Button
                  onClick={() => moveToRole("cloture")}
                  iconStart={<Check className="size-4" />}
                >
                  {ready ? "Clôturer, aucune récidive" : "Clôturer"}
                </Button>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>

      <FalseAlarmDialog
        open={falseAlarmOpen}
        hasSignal={Boolean(incident.signalType)}
        borneCode={borne?.code}
        signalLabel={signalRules.find((r) => r.signalType === incident.signalType)?.label}
        rejectColumnName={columnByRole(columns, "rejete")?.name}
        onCancel={() => setFalseAlarmOpen(false)}
        onConfirm={confirmFalseAlarm}
      />
    </SheetRoot>
  );
}
