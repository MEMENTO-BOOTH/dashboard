"use client";

import { Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type Assignee,
  type BorneSummary,
  CreateInterventionDialog,
  type InterventionCandidate,
} from "@/features/dashboard/alerts";
import type { Intervention } from "../api";
import { DeleteInterventionDialog } from "./delete-intervention-dialog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function InterventionsList({
  interventions,
  candidates,
  allBornes,
  assignees,
  canCreate = false,
  canDelete = false,
}: {
  interventions: Intervention[];
  candidates: InterventionCandidate[];
  allBornes: BorneSummary[];
  assignees: Assignee[];
  canCreate?: boolean;
  canDelete?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Intervention | null>(null);

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
        {canCreate ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-9 items-center gap-2 rounded-[8px] bg-foreground px-4 text-[14px] font-medium leading-5 text-background transition-colors hover:bg-foreground/90"
          >
            <Plus className="size-4" />
            Créer
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[14px] text-muted-foreground">
          Aucune intervention enregistrée.
        </p>
      ) : (
        <div className="overflow-clip rounded-[10px] border border-border">
          <div className="border-b border-border bg-muted/50 px-6 py-3">
            <div className="grid grid-cols-[1fr_1fr_120px_100px_120px_48px] gap-4">
              <ColHeader>Type</ColHeader>
              <ColHeader>Borne</ColHeader>
              <ColHeader>Date</ColHeader>
              <ColHeader>Durée</ColHeader>
              <ColHeader>Intervenant</ColHeader>
              <span className="sr-only">Actions</span>
            </div>
          </div>
          {filtered.map((i) => (
            <div
              key={i.id}
              className="grid grid-cols-[1fr_1fr_120px_100px_120px_48px] items-center gap-4 border-t border-border px-6 py-4 first:border-t-0"
            >
              <div className="flex flex-col">
                <span className="text-[14px] font-medium leading-5 text-foreground">{i.type}</span>
                {i.description ? (
                  <span className="truncate text-[13px] font-normal leading-5 text-muted-foreground">
                    {i.description}
                  </span>
                ) : null}
              </div>
              <span className="text-[14px] font-normal leading-5 text-foreground">
                {i.borne_nom}
              </span>
              <span className="text-[14px] font-normal leading-5 text-muted-foreground">
                {formatDate(i.date)}
              </span>
              <span className="text-[14px] font-normal leading-5 text-muted-foreground">
                {i.duree_minutes ? `${i.duree_minutes} min` : "—"}
              </span>
              <span className="text-[14px] font-normal leading-5 text-muted-foreground">
                {i.intervenant_nom}
              </span>
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => setToDelete(i)}
                  aria-label={`Supprimer l'intervention ${i.type}`}
                  title="Supprimer"
                  className="flex size-8 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <CreateInterventionDialog
        open={open}
        onOpenChange={setOpen}
        candidates={candidates}
        allBornes={allBornes}
        assignees={assignees}
      />

      {toDelete ? (
        <DeleteInterventionDialog
          open={true}
          onOpenChange={(next) => {
            if (!next) setToDelete(null);
          }}
          interventionId={toDelete.id}
          interventionLabel={`${toDelete.type} — ${toDelete.borne_nom}`}
        />
      ) : null}
    </div>
  );
}

function ColHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}
