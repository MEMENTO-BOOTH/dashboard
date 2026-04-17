"use client";

import { Plus, Search, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { createIntervention } from "../actions";
import type { Intervention } from "../api";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InterventionsList({
  interventions,
}: {
  interventions: Intervention[];
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return interventions;
    return interventions.filter(
      (i) =>
        i.type.toLowerCase().includes(needle) ||
        i.borne_nom.toLowerCase().includes(needle) ||
        (i.description ?? "").toLowerCase().includes(needle),
    );
  }, [interventions, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-9 w-[320px] items-center gap-1.5 rounded-[8px] border border-input bg-background px-3 py-1 shadow-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une intervention..."
            aria-label="Rechercher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-5 text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 items-center gap-2 rounded-[8px] bg-foreground px-4 text-[14px] font-medium leading-5 text-background transition-colors hover:bg-foreground/90"
        >
          <Plus className="size-4" />
          Créer
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[14px] text-muted-foreground">
          Aucune intervention enregistrée.
        </p>
      ) : (
        <div className="overflow-clip rounded-[10px] border border-border">
          <div className="border-b border-border bg-muted/50 px-6 py-3">
            <div className="grid grid-cols-[1fr_1fr_120px_100px_120px] gap-4">
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Type</span>
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Borne</span>
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Date</span>
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Durée</span>
              <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Intervenant</span>
            </div>
          </div>
          {filtered.map((i) => (
            <div key={i.id} className="grid grid-cols-[1fr_1fr_120px_100px_120px] items-center gap-4 border-t border-border px-6 py-4 first:border-t-0">
              <div className="flex flex-col">
                <span className="text-[14px] font-medium leading-5 text-foreground">{i.type}</span>
                {i.description ? (
                  <span className="truncate text-[13px] font-normal leading-5 text-muted-foreground">{i.description}</span>
                ) : null}
              </div>
              <span className="text-[14px] font-normal leading-5 text-foreground">{i.borne_nom}</span>
              <span className="text-[14px] font-normal leading-5 text-muted-foreground">{formatDate(i.date)}</span>
              <span className="text-[14px] font-normal leading-5 text-muted-foreground">
                {i.duree_minutes ? `${i.duree_minutes} min` : "—"}
              </span>
              <span className="text-[14px] font-normal leading-5 text-muted-foreground">{i.intervenant_nom}</span>
            </div>
          ))}
        </div>
      )}

      <CreateInterventionDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function CreateInterventionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createIntervention(fd);
      onOpenChange(false);
    });
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-1/2 w-full max-w-[500px] -translate-y-1/2 gap-0 rounded-[10px] border border-border bg-background p-0 shadow-lg">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-[18px] font-semibold leading-[28px] text-foreground">
              Nouvelle intervention
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-5 text-muted-foreground">
              Enregistrer une intervention sur une borne
            </DialogDescription>
          </div>
          <DialogClose className="flex size-8 items-center justify-center rounded-[6px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <X className="size-4" />
          </DialogClose>
        </div>

        <div className="h-px bg-border" />

        <form onSubmit={onSubmit} className="flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium leading-5 text-foreground">Borne</label>
            <input
              name="borne_id"
              required
              placeholder="ID de la borne"
              className="h-9 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium leading-5 text-foreground">Type</label>
            <input
              name="type"
              required
              placeholder="Ex: Changement papier, Remplacement caméra..."
              className="h-9 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium leading-5 text-foreground">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Détails de l'intervention..."
              className="rounded-[8px] border border-input bg-background px-3 py-2 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium leading-5 text-foreground">Durée (min)</label>
              <input
                name="duree_minutes"
                type="number"
                placeholder="30"
                className="h-9 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium leading-5 text-foreground">Intervenant</label>
              <input
                name="intervenant_id"
                required
                placeholder="ID utilisateur"
                className="h-9 rounded-[8px] border border-input bg-background px-3 text-[14px] font-normal leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-end gap-2">
            <DialogClose
              type="button"
              disabled={isPending}
              className="h-9 rounded-[8px] border border-border bg-background px-4 text-[14px] font-medium leading-5 text-foreground shadow-xs transition-colors hover:bg-accent"
            >
              Annuler
            </DialogClose>
            <button
              type="submit"
              disabled={isPending}
              className="h-9 rounded-[8px] bg-foreground px-4 text-[14px] font-medium leading-5 text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {isPending ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
