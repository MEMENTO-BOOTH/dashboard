"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { ORIGIN_LABELS, type Origin } from "../lib";

const ORIGINS = Object.entries(ORIGIN_LABELS).filter(([key]) => key !== "diag") as [
  Origin,
  string,
][];

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
  const [origin, setOrigin] = useState<Origin | null>(null);

  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="w-[90vw] max-w-sm p-5">
        <DialogTitle className="mb-3 text-base font-semibold">
          Quelle était l'origine de la panne ?
        </DialogTitle>
        <div className="flex flex-col gap-2">
          {ORIGINS.map(([value, label]) => (
            <Button
              key={value}
              variant={origin === value ? "primary" : "outline"}
              className="justify-start"
              onClick={() => setOrigin(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button disabled={!origin} onClick={() => origin && onConfirm(origin)}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
