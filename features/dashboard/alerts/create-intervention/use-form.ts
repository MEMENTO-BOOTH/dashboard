"use client";

import { useMemo, useState, useTransition } from "react";
import { createInterventionsBulk } from "../intervention-actions";
import type {
  BorneSummary,
  InterventionCandidate,
  InterventionMode,
  MaterielType,
} from "../intervention-types";

export function useInterventionForm(
  candidates: InterventionCandidate[],
  onDone: () => void,
  lockedMode?: InterventionMode,
) {
  const [mode, setMode] = useState<InterventionMode | null>(lockedMode ?? null);
  const [materiel, setMateriel] = useState<MaterielType>("camera");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const items = useMemo(() => {
    const out: { borne_id: string; type: string; alerte_id: string | null }[] = [];
    if (mode === "alerte") {
      for (const c of candidates) {
        if (!selected.has(c.borne_id)) continue;
        for (const i of c.issues) {
          out.push(
            i.kind === "alerte"
              ? { borne_id: c.borne_id, type: i.type, alerte_id: i.alerte_id }
              : { borne_id: c.borne_id, type: "papier_bas", alerte_id: null },
          );
        }
      }
    } else if (mode === "maintenance") {
      for (const borneId of selected) {
        out.push({ borne_id: borneId, type: `maintenance_${materiel}`, alerte_id: null });
      }
    }
    return out;
  }, [candidates, selected, mode, materiel]);

  function toggle(borneId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(borneId)) next.delete(borneId);
      else next.add(borneId);
      return next;
    });
  }

  function changeMode(m: InterventionMode | null) {
    setMode(m);
    setSelected(new Set());
  }

  function reset() {
    setMode(lockedMode ?? null);
    setMateriel("camera");
    setSelected(new Set());
    setAssigneeId("");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    setError(null);
  }

  function submit() {
    setError(null);
    if (!assigneeId || items.length === 0) return;
    startTransition(async () => {
      try {
        await createInterventionsBulk({
          items,
          intervenant_id: assigneeId,
          date,
          description: notes.trim() || undefined,
        });
        reset();
        onDone();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    });
  }

  return {
    mode,
    changeMode,
    materiel,
    setMateriel,
    selected,
    toggle,
    assigneeId,
    setAssigneeId,
    date,
    setDate,
    notes,
    setNotes,
    error,
    isPending,
    items,
    submit,
  };
}

// Filtre helper utilisé par le dialog
export function filterBornesBySearch<T extends { nom_lieu: string }>(
  list: T[],
  search: string,
): T[] {
  const needle = search.trim().toLowerCase();
  if (!needle) return list;
  return list.filter((b) => b.nom_lieu.toLowerCase().includes(needle));
}
