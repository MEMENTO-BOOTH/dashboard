"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TableHeader } from "./_parts/table-header";
import { TableRow } from "./_parts/table-row";
import { useBorneFilters } from "./hooks/use-borne-filters";
import type { BorneTableRow } from "./schemas";

const COLUMNS = [
  { label: "", w: 49 },
  { label: "Borne", w: 350 },
  { label: "Alertes", w: 160 },
  { label: "Activité", w: 160 },
  { label: "CA", w: 160 },
  { label: "Papier", w: 200 },
  { label: "Actions", w: 110 },
];

export function BornesTable({ rows }: { rows: BorneTableRow[] }) {
  const { q, type } = useBorneFilters();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((row) => {
      if (type !== "all" && row.statut !== type) return false;
      if (needle.length === 0) return true;
      return (
        row.name.toLowerCase().includes(needle) ||
        row.subtitle.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, type]);

  return (
    <Card className="w-full">
      <TableHeader />

      <div className="overflow-x-auto">
        <div className="min-w-[1189px]">
          <div className="grid h-14 grid-cols-[49px_350px_160px_160px_160px_200px_110px] items-center border-t border-border">
            {COLUMNS.map((col, i) => (
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
            filtered.map((row) => <TableRow key={row.id} row={row} />)
          )}
        </div>
      </div>
    </Card>
  );
}
