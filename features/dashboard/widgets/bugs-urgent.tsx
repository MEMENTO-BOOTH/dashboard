"use client";

import { EllipsisVertical, FileMinus, Store } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CriticalProgress } from "@/components/ui/critical-progress";
import { NumberAvatar, type NumberAvatarItem } from "@/components/ui/number-avatar";
import { BugsOverlay } from "../_parts/bugs-overlay";
import { PaperOverlay } from "../_parts/paper-overlay";
import { type Bug, type PaperBorne, TOTAL_SHEETS } from "../data";
import { alertIconFor } from "../lib/alert-icon";

const PREVIEW_LIMIT = 3;

function CardTitle({ title }: { title: string }) {
  return <p className="text-[18px] font-semibold leading-[28px] text-card-foreground">{title}</p>;
}

function MoreButton() {
  return (
    <button
      type="button"
      aria-label="More options"
      className="text-muted-foreground hover:text-foreground"
    >
      <EllipsisVertical className="size-4" />
    </button>
  );
}

function BugRow({ bug }: { bug: Bug }) {
  return (
    <div className="flex h-[72px] items-center gap-4 px-6">
      <div className="relative flex size-[38px] shrink-0 items-center justify-center overflow-clip rounded-full bg-muted text-muted-foreground">
        {bug.avatar ? (
          // biome-ignore lint/performance/noImgElement: avatar
          <img src={bug.avatar} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <Store className="size-5" aria-hidden />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-[16px] font-medium leading-6 text-card-foreground">
          {bug.title}
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

function paperEmoji(percent: number): string {
  if (percent > 75) return "😊";
  if (percent > 50) return "🙂";
  if (percent > 25) return "😐";
  return "😔";
}

function PaperRow({ borne }: { borne: PaperBorne }) {
  const percent = (borne.sheets / TOTAL_SHEETS) * 100;
  return (
    <div className="flex h-[72px] items-center gap-4 px-6">
      <div className="relative flex size-[38px] shrink-0 items-center justify-center overflow-clip rounded-full bg-muted text-muted-foreground">
        {borne.avatar ? (
          // biome-ignore lint/performance/noImgElement: avatar
          <img src={borne.avatar} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <Store className="size-5" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <CriticalProgress
          title={borne.name}
          value={percent}
          label={`${borne.sheets} / ${TOTAL_SHEETS}`}
          emoji={paperEmoji(percent)}
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
}: {
  bugs: Bug[];
  totalBugs: number;
  allBugs: Bug[];
  paperBornes: PaperBorne[];
  totalPaperBornes: number;
  allPaperBornes: PaperBorne[];
}) {
  const [bugsOpen, setBugsOpen] = useState(false);
  const [paperOpen, setPaperOpen] = useState(false);

  const extraBugs = Math.max(0, totalBugs - PREVIEW_LIMIT);
  const extraPaper = Math.max(0, totalPaperBornes - PREVIEW_LIMIT);

  return (
    <Card className="gap-6 py-6">
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
          <MoreButton />
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

      <BugsOverlay
        open={bugsOpen}
        onOpenChange={setBugsOpen}
        bugs={allBugs}
        total={totalBugs}
      />
      <PaperOverlay
        open={paperOpen}
        onOpenChange={setPaperOpen}
        bornes={allPaperBornes}
        total={totalPaperBornes}
      />
    </Card>
  );
}
