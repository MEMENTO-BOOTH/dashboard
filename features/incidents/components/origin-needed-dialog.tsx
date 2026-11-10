"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { ORIGIN_LABELS, type Origin } from "../lib";
import { ORIGIN_ICONS } from "./origin-icons";

const ORIGINS: Origin[] = ["logiciel", "materiel", "reseau"];

/** RG-07 : l'origine est obligatoire pour clôturer tant qu'elle vaut « À diagnostiquer ». */
export function OriginNeededDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: (origin: Origin) => void;
}) {
  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="w-[92vw] max-w-[560px] rounded-[14px] border-border bg-card p-6 shadow-sm">
        <DialogTitle className="text-[18px] font-semibold leading-[28px] text-card-foreground">
          Quelle était l'origine de la panne ?
        </DialogTitle>
        <DialogDescription className="mt-1 text-[14px] leading-5 text-muted-foreground">
          Obligatoire pour clôturer : c'est ce qui rendra tes statistiques par borne fiables.
        </DialogDescription>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
          {ORIGINS.map((origin) => {
            const Icon = ORIGIN_ICONS[origin];
            return (
              <button
                key={origin}
                type="button"
                onClick={() => onConfirm(origin)}
                className="flex items-center gap-2.5 rounded-[10px] border border-input bg-background px-3 py-2.5 text-left text-sm font-medium hover:bg-muted/60"
              >
                <Icon className="size-4" />
                {ORIGIN_LABELS[origin]}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
