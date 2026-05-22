"use client";

import { useTransition } from "react";
import type { BorneEnvironnement } from "@/features/bornes";
import { updateBorneEnvironnement } from "@/features/bornes/actions";
import { cn } from "@/lib/utils/cn";

// Pattern segmente — meme structure visuelle que LayoutToggle (components/ui/layout-toggle.tsx).

const OPTIONS: { value: BorneEnvironnement; label: string }[] = [
  { value: "prod", label: "Prod" },
  { value: "dev", label: "Dev" },
];

export function EnvironnementToggle({
  borneId,
  current,
  canEdit = false,
}: {
  borneId: string;
  current: BorneEnvironnement;
  canEdit?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function onChange(next: BorneEnvironnement) {
    if (!canEdit || next === current || isPending) return;
    startTransition(async () => {
      await updateBorneEnvironnement(borneId, next);
    });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0 overflow-clip rounded-[10px] border border-input p-[3px]",
        isPending && "opacity-60",
      )}
      aria-busy={isPending}
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === current;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={!canEdit || isPending}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "flex h-8 items-center justify-center rounded-[6px] px-3 py-1 text-sm font-medium leading-5 text-foreground",
              active && "bg-input shadow-sm",
              !canEdit && "cursor-not-allowed",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
