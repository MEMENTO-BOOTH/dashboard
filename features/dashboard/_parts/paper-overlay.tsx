"use client";

import { EllipsisVertical, Store } from "lucide-react";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { SegmentedBar } from "@/components/ui/segmented-bar";
import type { PaperBorne } from "../data";
import { TOTAL_SHEETS } from "../data";

// Figma 16482:114427 structure + Figma 39616:58799 segmented bar for trailing.

export function PaperOverlay({
  open,
  onOpenChange,
  bornes,
  total,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bornes: PaperBorne[];
  total: number;
}) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-1/2 w-full max-w-[800px] -translate-y-1/2 gap-0 overflow-clip rounded-[14px] border border-border bg-card p-0 shadow-sm">
        <DialogDescription className="sr-only">
          Niveaux de papier restant par borne
        </DialogDescription>
        <div className="flex flex-col gap-9 py-6">
          <div className="flex items-start gap-2 px-6">
            <DialogTitle className="flex-1 text-[18px] font-semibold leading-[28px] text-card-foreground">
              Papier à changer · {total}
            </DialogTitle>
            <button
              type="button"
              aria-label="More options"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <EllipsisVertical className="size-4" />
            </button>
          </div>
          <div className="flex max-h-[50vh] flex-col gap-4 overflow-y-auto">
            {bornes.map((borne) => (
              <div key={borne.id} className="flex items-center gap-3 px-6">
                <div className="relative flex size-9 shrink-0 items-center justify-center overflow-clip rounded-[6px]">
                  {borne.avatar ? (
                    // biome-ignore lint/performance/noImgElement: avatar
                    <img src={borne.avatar} alt="" className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-primary opacity-10" />
                      <Store className="size-[18px] text-primary" aria-hidden />
                    </>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-[16px] font-normal leading-6 text-card-foreground">
                    {borne.name}
                  </p>
                  <p className="truncate text-[14px] font-normal leading-5 text-muted-foreground">
                    {borne.sheets} / {TOTAL_SHEETS} feuilles
                  </p>
                </div>
                <SegmentedBar value={borne.sheets} max={TOTAL_SHEETS} />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
