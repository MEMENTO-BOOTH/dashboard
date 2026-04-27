"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteIntervention } from "../actions";

// Figma node 15108:20280 — AlertDialog shadcn studio v5

export function DeleteInterventionDialog({
  open,
  onOpenChange,
  interventionId,
  interventionLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interventionId: string;
  interventionLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await deleteIntervention(interventionId);
      if (result.ok) onOpenChange(false);
    });
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ width: "min(calc(100vw - 32px), 500px)" }}
        className="top-1/2 -translate-y-1/2 flex flex-col items-start gap-4 rounded-[10px] border border-border bg-background p-6 shadow-lg"
      >
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-[18px] font-semibold leading-7 text-foreground">
            Êtes-vous absolument sûr ?
          </DialogTitle>
          <DialogDescription className="max-w-[435px] text-[14px] font-normal leading-5 text-muted-foreground">
            Cette action est irréversible. L'intervention «{interventionLabel}» sera définitivement
            supprimée de la base.
          </DialogDescription>
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          <DialogClose
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-background px-4 py-2 text-[14px] font-medium leading-5 text-foreground shadow-xs transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </DialogClose>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-2 overflow-clip rounded-[10px] bg-primary px-4 py-2 text-[14px] font-medium leading-5 text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Continuer
          </button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
