"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot, DialogTitle } from "@/components/ui/dialog";

export function FalseAlarmDialog({
  open,
  hasSignal,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  hasSignal: boolean;
  onCancel: () => void;
  onConfirm: (options: { ignoreSignal: boolean; reason: string }) => void;
}) {
  const [ignoreSignal, setIgnoreSignal] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="w-[90vw] max-w-sm p-5">
        <DialogTitle className="mb-3 text-base font-semibold">Classer en fausse alerte</DialogTitle>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Pourquoi est-ce une fausse alerte ? (optionnel)"
          className="min-h-20 w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {hasSignal && (
          <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={ignoreSignal}
              onChange={(e) => setIgnoreSignal(e.target.checked)}
              className="size-4"
            />
            Ne plus jamais créer d'incident pour ce signal sur cette borne
          </label>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={() => onConfirm({ ignoreSignal, reason })}>
            Classer en fausse alerte
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
