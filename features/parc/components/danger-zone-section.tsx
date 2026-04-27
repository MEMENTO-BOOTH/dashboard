"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteBorne } from "@/features/bornes/actions";

export function DangerZoneSection({ borneId, borneNom }: { borneId: string; borneNom: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      await deleteBorne(borneId);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-[24px] font-semibold leading-8 text-foreground">Supprimer la borne</h2>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">
          Supprimez définitivement cette borne et toutes ses données
        </p>
      </div>

      <div className="rounded-[10px] border border-dashed border-destructive/40 bg-destructive/5 p-6">
        <div className="flex gap-4">
          <div className="flex shrink-0 items-center justify-center rounded-[10px] border border-destructive bg-background p-3 shadow-xs">
            <Trash2 className="size-4 text-destructive" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-semibold leading-6 text-foreground">
              Supprimer cette borne supprimera aussi toutes ses données.
            </p>
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">
              Assurez-vous d'avoir fait une sauvegarde si vous souhaitez conserver les données.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-[10px] border border-destructive/30 bg-destructive/5 px-4 py-2 text-[14px] font-medium leading-5 text-destructive transition-colors hover:bg-destructive/10"
          >
            Supprimer la borne
          </button>
        </div>
      </div>

      <DialogRoot open={open} onOpenChange={setOpen}>
        <DialogContent className="top-1/2 w-full max-w-[500px] -translate-y-1/2 gap-4 rounded-[10px] border-none bg-background p-6 shadow-lg">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-[18px] font-semibold leading-[28px] text-foreground">
              Êtes-vous absolument sûr ?
            </DialogTitle>
            <DialogDescription className="max-w-[435px] text-[14px] font-normal leading-5 text-muted-foreground">
              Cette action est irréversible. Elle supprimera définitivement la borne «{borneNom}» et
              toutes ses données associées de nos serveurs.
            </DialogDescription>
          </div>
          <div className="flex items-center justify-end gap-2">
            <DialogClose
              disabled={isPending}
              className="rounded-[10px] border border-border bg-background px-4 py-2 text-[14px] font-medium leading-5 text-foreground shadow-xs transition-colors hover:bg-accent"
            >
              Annuler
            </DialogClose>
            <button
              type="button"
              onClick={onDelete}
              disabled={isPending}
              className="flex items-center gap-2 rounded-[10px] bg-destructive px-4 py-2 text-[14px] font-medium leading-5 text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Confirmer la suppression
            </button>
          </div>
        </DialogContent>
      </DialogRoot>
    </div>
  );
}
