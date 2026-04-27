"use client";

import { EllipsisVertical, Store } from "lucide-react";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { alertIconFor, alertLabelFor } from "../alerts";
import type { Bug } from "../data";

// Figma 16482:114427 "Top products by Sales" — verbatim structure.
// Card: bg-card border border-border rounded-[14px] shadow-sm overflow-clip py-6
// Header: flex gap-2 items-start px-6 — title 18px SemiBold + EllipsisVertical size-4
// Gap header→items: gap-9 (36px)
// Items: flex-col gap-4
// Row: flex gap-3 items-center px-6
//   Icon-box: relative size-[36px], bg-primary opacity-10 rounded-[6px], icon centered
//   Text: flex-1 flex-col — name 16px Regular leading-[24px] + sub 14px Regular leading-[20px] muted
//   Trailing: 14px Regular leading-[20px] card-foreground

export function BugsOverlay({
  open,
  onOpenChange,
  bugs,
  total,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bugs: Bug[];
  total: number;
}) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-1/2 w-full max-w-[800px] -translate-y-1/2 gap-0 overflow-clip rounded-[14px] border border-border bg-card p-0 shadow-sm">
        <DialogDescription className="sr-only">
          Liste des alertes critiques actives
        </DialogDescription>
        <div className="flex flex-col gap-9 py-6">
          <div className="flex items-start gap-2 px-6">
            <DialogTitle className="flex-1 text-[18px] font-semibold leading-[28px] text-card-foreground">
              Bugs urgent · {total}
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
            {bugs.map((bug) => {
              const Icon = alertIconFor(bug.title);
              return (
                <div key={bug.id} className="flex items-center gap-3 px-6">
                  <div className="relative flex size-9 shrink-0 items-center justify-center overflow-clip rounded-[6px]">
                    {bug.avatar ? (
                      // biome-ignore lint/performance/noImgElement: avatar
                      <img
                        src={bug.avatar}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-primary opacity-10" />
                        <Icon className="size-[18px] text-primary" aria-hidden />
                      </>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-[16px] font-normal leading-6 text-card-foreground">
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
            })}
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
