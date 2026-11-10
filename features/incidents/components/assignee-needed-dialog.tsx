"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogRoot, DialogTitle } from "@/components/ui/dialog";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import type { Assignee } from "@/features/dashboard/alerts";

/** RG-06 : un responsable est obligatoire pour sortir de l'Entrée (sauf vers Rejet). */
export function AssigneeNeededDialog({
  open,
  assignees,
  currentUserId,
  entreeName,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  assignees: readonly Assignee[];
  currentUserId: string;
  entreeName: string;
  onCancel: () => void;
  onConfirm: (assigneeId: string) => void;
}) {
  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="w-[92vw] max-w-[560px] rounded-[14px] border-border bg-card p-6 shadow-sm">
        <DialogTitle className="text-[18px] font-semibold leading-[28px] text-card-foreground">
          Qui s'occupe de cet incident ?
        </DialogTitle>
        <DialogDescription className="mt-1 text-[14px] leading-5 text-muted-foreground">
          Un incident ne quitte pas « {entreeName} » sans responsable. Sinon, personne ne s'en
          occupe vraiment.
        </DialogDescription>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
          {assignees.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onConfirm(a.id)}
              className="flex items-center gap-2.5 rounded-[10px] border border-input bg-background px-3 py-2.5 text-left text-sm font-medium hover:bg-muted/60"
            >
              <InitialsAvatar
                name={a.nom}
                logoUrl={a.logo_url}
                className="size-8 rounded-full text-[12px]"
              />
              <span>
                {a.nom}
                {a.id === currentUserId && <span className="text-muted-foreground"> (moi)</span>}
              </span>
            </button>
          ))}
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
