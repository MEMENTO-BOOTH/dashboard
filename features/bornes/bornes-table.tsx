"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TableHeader } from "./_parts/table-header";
import { TableRow } from "./_parts/table-row";
import { useBorneFilters } from "./hooks/use-borne-filters";
import type { BorneTableRow } from "./schemas";

const BASE_COLUMNS = [
  { label: "", w: 49 },
  { label: "Borne", w: 350 },
  { label: "Alertes", w: 160 },
  { label: "Activité", w: 160 },
  { label: "CA", w: 160 },
  { label: "Papier", w: 200 },
  { label: "Actions", w: 80 },
];

// Borne = `minmax(350px,1fr)` → absorbe l'espace résiduel
// → Actions reste collé à droite, jamais d'espace mort
const GRID_WITH_CA = "49px minmax(350px,1fr) 160px 160px 160px 200px 80px";
const GRID_WITHOUT_CA = "49px minmax(350px,1fr) 160px 160px 200px 80px";
const MIN_W_WITH_CA = 1159;
const MIN_W_WITHOUT_CA = 999;

export function BornesTable({ rows, showCa = true }: { rows: BorneTableRow[]; showCa?: boolean }) {
  const { q, type } = useBorneFilters();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((row) => {
      if (type !== "all" && row.statut !== type) return false;
      if (needle.length === 0) return true;
      return row.name.toLowerCase().includes(needle) || row.subtitle.toLowerCase().includes(needle);
    });
  }, [rows, q, type]);

  const columns = showCa ? BASE_COLUMNS : BASE_COLUMNS.filter((c) => c.label !== "CA");
  const gridCols = showCa ? GRID_WITH_CA : GRID_WITHOUT_CA;
  const minW = showCa ? MIN_W_WITH_CA : MIN_W_WITHOUT_CA;

  return (
    <Card className="w-full">
      <TableHeader />

      <div className="overflow-x-auto">
        <div style={{ minWidth: minW }}>
          <div
            className="grid h-14 items-center gap-x-3 border-t border-border"
            style={{ gridTemplateColumns: gridCols }}
          >
            {columns.map((col, i) => (
              <div
                key={col.label || `col-${i}`}
                className="px-2 text-[14px] font-medium leading-5 text-muted-foreground"
              >
                {col.label}
              </div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="flex h-14 items-center border-t border-border px-6 text-[14px] text-muted-foreground">
              Aucune borne ne correspond.
            </div>
          ) : (
            filtered.map((row) => <TableRow key={row.id} row={row} showCa={showCa} />)
          )}
        </div>
      </div>
    </Card>
  );
}
