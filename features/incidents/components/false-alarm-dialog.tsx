"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "@/components/ui/dialog";

export function FalseAlarmDialog({
  open,
  hasSignal,
  borneCode,
  signalLabel,
  rejectColumnName,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  hasSignal: boolean;
  borneCode?: string;
  signalLabel?: string;
  rejectColumnName?: string;
  onCancel: () => void;
  onConfirm: (options: { ignoreSignal: boolean; reason: string }) => void;
}) {
  const reasonId = useId();
  const [ignoreSignal, setIgnoreSignal] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="w-[92vw] max-w-[480px] rounded-[14px] border-border bg-card p-6 shadow-sm">
        <DialogTitle className="text-[18px] font-semibold leading-[28px] text-card-foreground">
          Classer en fausse alerte
        </DialogTitle>
        <DialogDescription className="mt-1 text-[14px] leading-5 text-muted-foreground">
          L'incident part dans « {rejectColumnName ?? "Fausses alertes"} ». Il reste consultable.
        </DialogDescription>
        <div className="mt-4 flex flex-col gap-3.5">
          {hasSignal && (
            <label className="flex items-start gap-2.5 rounded-md border border-input p-3 text-[13.5px] text-foreground">
              <input
                type="checkbox"
                checked={ignoreSignal}
                onChange={(e) => setIgnoreSignal(e.target.checked)}
                className="mt-0.5 size-4"
              />
              <span>
                Ne plus créer d'incident pour « {signalLabel ?? "ce signal"} » sur la borne{" "}
                {borneCode ?? ""}
                <span className="mt-1 block text-xs text-muted-foreground">
                  Utile quand le signal est normal pour ce bar (fermeture annuelle, borne débranchée
                  exprès). Réactivable dans Paramètres.
                </span>
              </span>
            </label>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={reasonId} className="text-xs font-medium text-muted-foreground">
              Pourquoi ? (facultatif)
            </label>
            <textarea
              id={reasonId}
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex. : bar fermé pour congés, borne éteinte volontairement"
              className="min-h-16 w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={() => onConfirm({ ignoreSignal, reason })}>
            Classer en fausse alerte
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
