"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { BorneSummary, InterventionCandidate, InterventionMode } from "../intervention-types";
import { BorneRow, BorneSimpleRow } from "./borne-row";
import { filterBornesBySearch } from "./use-form";

export function BornesSection({
  mode,
  candidates,
  allBornes,
  selected,
  onToggle,
}: {
  mode: InterventionMode;
  candidates: InterventionCandidate[];
  allBornes: BorneSummary[];
  selected: Set<string>;
  onToggle: (borneId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => filterBornesBySearch(allBornes, search), [allBornes, search]);

  if (mode === "alerte") {
    if (candidates.length === 0) {
      return (
        <p className="rounded-[10px] border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-[13px] leading-5 text-muted-foreground">
          Aucune borne n'a besoin d'intervention physique.
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-2.5">
        {candidates.map((c) => (
          <BorneRow
            key={c.borne_id}
            candidate={c}
            selected={selected.has(c.borne_id)}
            onToggle={() => onToggle(c.borne_id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une borne…"
          className="h-10 w-full rounded-[10px] border border-input bg-background pl-9 pr-3 text-[14px] leading-5 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </label>
      <div className="flex max-h-[260px] flex-col gap-2.5 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-muted-foreground">
            Aucune borne trouvée.
          </p>
        ) : (
          filtered.map((b) => (
            <BorneSimpleRow
              key={b.id}
              borne={b}
              selected={selected.has(b.id)}
              onToggle={() => onToggle(b.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
