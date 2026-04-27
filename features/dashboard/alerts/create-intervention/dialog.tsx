"use client";

import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  Assignee,
  BorneSummary,
  InterventionCandidate,
  InterventionMode,
} from "../intervention-types";
import { FormBody } from "./form-body";
import { ModeChoice } from "./mode-choice";
import { useInterventionForm } from "./use-form";

export function CreateInterventionDialog({
  open,
  onOpenChange,
  candidates,
  allBornes,
  assignees,
  lockedMode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: InterventionCandidate[];
  allBornes: BorneSummary[];
  assignees: Assignee[];
  lockedMode?: InterventionMode;
}) {
  const f = useInterventionForm(candidates, () => onOpenChange(false), lockedMode);
  const canSubmit = !f.isPending && !!f.assigneeId && f.items.length > 0;
  const showBack = !lockedMode && f.mode !== null;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ width: "min(calc(100vw - 32px), 760px)", maxHeight: "92vh" }}
        className="top-[4%] overflow-hidden p-0"
      >
        <div className="flex max-h-[92vh] flex-col">
          <Header mode={f.mode} showBack={showBack} onBack={() => f.changeMode(null)} />

          <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-8 py-7">
            {f.mode === null ? (
              <ModeChoice onSelect={f.changeMode} alerteCount={candidates.length} />
            ) : (
              <FormBody f={f} candidates={candidates} allBornes={allBornes} assignees={assignees} />
            )}
          </div>

          {f.mode !== null ? (
            <Footer
              itemsCount={f.items.length}
              error={f.error}
              isPending={f.isPending}
              canSubmit={canSubmit}
              onSubmit={f.submit}
            />
          ) : null}
        </div>
      </DialogContent>
    </DialogRoot>
  );
}

function Header({
  mode,
  showBack,
  onBack,
}: {
  mode: InterventionMode | null;
  showBack: boolean;
  onBack: () => void;
}) {
  const subtitle =
    mode === "alerte"
      ? "Sélectionne les bornes à visiter pour résoudre des alertes."
      : mode === "maintenance"
        ? "Planifie une visite de maintenance."
        : "Choisis le type d'intervention.";

  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-8 py-6">
      <div className="flex items-start gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Retour"
            className="mt-1 shrink-0 rounded-[8px] p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
        ) : null}
        <div className="flex flex-col gap-1">
          <DialogTitle className="text-[20px] font-semibold leading-7 text-foreground">
            Créer une intervention
          </DialogTitle>
          <DialogDescription className="text-[14px] font-normal leading-5 text-muted-foreground">
            {subtitle}
          </DialogDescription>
        </div>
      </div>
      <DialogClose
        aria-label="Fermer"
        className="shrink-0 rounded-[8px] p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <X className="size-4" />
      </DialogClose>
    </div>
  );
}

function Footer({
  itemsCount,
  error,
  isPending,
  canSubmit,
  onSubmit,
}: {
  itemsCount: number;
  error: string | null;
  isPending: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-8 py-5">
      <p className="text-[13px] leading-5 text-muted-foreground">
        {itemsCount === 0
          ? "Sélectionne au moins 1 borne"
          : `${itemsCount} intervention${itemsCount > 1 ? "s" : ""}`}
        {error ? <span className="ml-2 text-destructive">· {error}</span> : null}
      </p>
      <div className="flex items-center gap-2">
        <DialogClose asChild>
          <Button variant="outline" size="md" disabled={isPending}>
            Annuler
          </Button>
        </DialogClose>
        <Button
          variant="primary"
          size="md"
          onClick={onSubmit}
          disabled={!canSubmit}
          loading={isPending}
        >
          Créer l'intervention
        </Button>
      </div>
    </div>
  );
}
