"use client";

import { EllipsisVertical, FileMinus } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CriticalProgress } from "@/components/ui/critical-progress";
import { NumberAvatar, type NumberAvatarItem } from "@/components/ui/number-avatar";
import { BugsOverlay } from "../_parts/bugs-overlay";
import { PaperOverlay } from "../_parts/paper-overlay";
import {
  AlertBadge,
  type Assignee,
  alertIconFor,
  alertLabelFor,
  type BorneSummary,
  CreateInterventionDialog,
  type InterventionCandidate,
} from "../alerts";
import { type Bug, type PaperBorne, TOTAL_SHEETS } from "../data";

const PREVIEW_LIMIT = 3;

function paperEmoji(sheets: number): string {
  if (sheets < 50) return "🚨";
  if (sheets < 80) return "⚠️";
  return "";
}

function CardTitle({ title }: { title: string }) {
  return <p className="text-[18px] font-semibold leading-[28px] text-card-foreground">{title}</p>;
}

function MoreButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Créer une intervention"
      title="Créer une intervention"
      className="text-muted-foreground hover:text-foreground"
    >
      <EllipsisVertical className="size-4" />
    </button>
  );
}

function BugRow({ bug }: { bug: Bug }) {
  return (
    <div className="flex h-[72px] items-center gap-4 px-6">
      <AlertBadge type={bug.title} size={38} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-[16px] font-medium leading-6 text-card-foreground">
          {alertLabelFor(bug.title)}
        </p>
        <p className="truncate text-[14px] font-normal leading-5 text-muted-foreground">
          {bug.place}
        </p>
      </div>
      <p className="shrink-0 whitespace-nowrap text-[14px] font-normal leading-5 text-card-foreground">
        {bug.time}
      </p>
    </div>
  );
}

function PaperRow({ borne }: { borne: PaperBorne }) {
  const percent = (borne.sheets / TOTAL_SHEETS) * 100;
  // ≤ 10 % → critique (rouge, icône "fin_papier") · sinon warning (orange, icône "papier_bas")
  const type = percent <= 10 ? "fin_papier" : "papier_bas";

  return (
    <div className="flex h-[72px] items-center gap-4 px-6">
      <AlertBadge type={type} size={38} />
      <div className="min-w-0 flex-1">
        <CriticalProgress
          title={borne.name}
          value={percent}
          label={`${borne.sheets} / ${TOTAL_SHEETS}`}
          emoji={paperEmoji(borne.sheets)}
        />
      </div>
    </div>
  );
}

function bugsToAvatarItems(bugs: Bug[], limit = 3): NumberAvatarItem[] {
  return bugs.slice(0, limit).map((b) => ({
    key: b.id,
    icon: alertIconFor(b.title),
    label: b.title,
  }));
}

function papersToAvatarItems(papers: PaperBorne[], limit = 3): NumberAvatarItem[] {
  return papers.slice(0, limit).map((p) => ({
    key: p.id,
    icon: FileMinus,
    label: p.name,
  }));
}

export function BugsUrgent({
  bugs,
  totalBugs,
  allBugs,
  paperBornes,
  totalPaperBornes,
  allPaperBornes,
  interventionCandidates,
  allBornes,
  assignees,
  canCreateIntervention = false,
}: {
  bugs: Bug[];
  totalBugs: number;
  allBugs: Bug[];
  paperBornes: PaperBorne[];
  totalPaperBornes: number;
  allPaperBornes: PaperBorne[];
  interventionCandidates: InterventionCandidate[];
  allBornes: BorneSummary[];
  assignees: Assignee[];
  canCreateIntervention?: boolean;
}) {
  const [bugsOpen, setBugsOpen] = useState(false);
  const [paperOpen, setPaperOpen] = useState(false);
  const [interventionOpen, setInterventionOpen] = useState(false);

  const extraBugs = Math.max(0, totalBugs - PREVIEW_LIMIT);
  const extraPaper = Math.max(0, totalPaperBornes - PREVIEW_LIMIT);

  return (
    <Card className="h-full gap-6 py-6">
      <div className="flex items-center justify-between gap-2 px-6">
        <div className="flex items-center gap-3">
          <CardTitle title="Bugs urgent" />
          {extraBugs > 0 ? (
            <NumberAvatar
              items={bugsToAvatarItems(allBugs)}
              extra={extraBugs}
              onClick={() => setBugsOpen(true)}
            />
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <CardTitle title="Papier à changer" />
          {extraPaper > 0 ? (
            <NumberAvatar
              items={papersToAvatarItems(allPaperBornes)}
              extra={extraPaper}
              onClick={() => setPaperOpen(true)}
            />
          ) : null}
          {canCreateIntervention ? (
            <MoreButton onClick={() => setInterventionOpen(true)} />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-[1fr_1px_1fr] lg:gap-x-6">
        <div className="flex flex-col gap-4">
          {bugs.map((bug) => (
            <BugRow key={bug.id} bug={bug} />
          ))}
        </div>
        <div className="hidden bg-border lg:block" />
        <div className="flex flex-col gap-4">
          {paperBornes.map((borne) => (
            <PaperRow key={borne.id} borne={borne} />
          ))}
        </div>
      </div>

      <BugsOverlay open={bugsOpen} onOpenChange={setBugsOpen} bugs={allBugs} total={totalBugs} />
      <PaperOverlay
        open={paperOpen}
        onOpenChange={setPaperOpen}
        bornes={allPaperBornes}
        total={totalPaperBornes}
      />
      <CreateInterventionDialog
        open={interventionOpen}
        onOpenChange={setInterventionOpen}
        candidates={interventionCandidates}
        allBornes={allBornes}
        assignees={assignees}
        lockedMode="alerte"
      />
    </Card>
  );
}
