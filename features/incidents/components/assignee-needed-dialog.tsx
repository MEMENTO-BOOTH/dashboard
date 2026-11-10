"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Assignee } from "@/features/dashboard/alerts";

/** RG-06 : un responsable est obligatoire pour sortir de l'Entrée (sauf vers Rejet). */
export function AssigneeNeededDialog({
  open,
  assignees,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  assignees: readonly Assignee[];
  onCancel: () => void;
  onConfirm: (assigneeId: string) => void;
}) {
  const [assigneeId, setAssigneeId] = useState<string>("");

  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="w-[90vw] max-w-sm p-5">
        <DialogTitle className="mb-3 text-base font-semibold">
          Qui s'occupe de cet incident ?
        </DialogTitle>
        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir un responsable" />
          </SelectTrigger>
          <SelectContent>
            {assignees.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button disabled={!assigneeId} onClick={() => onConfirm(assigneeId)}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
