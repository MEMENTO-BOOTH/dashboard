"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { InitialsAvatar } from "@/components/ui/initials-avatar";
import { type LayoutMode, LayoutToggle } from "@/components/ui/layout-toggle";
import type { BorneTableRow } from "@/features/bornes";
import { useBorneFilters } from "@/features/bornes/hooks/use-borne-filters";

function BorneCard({ borne }: { borne: BorneTableRow }) {
  return (
    <Link
      href={`/parc/bornes/${borne.id}`}
      className="flex flex-col gap-4 rounded-[14px] border border-border bg-card p-6 shadow-sm transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <InitialsAvatar
          name={borne.name}
          logoUrl={borne.logoUrl}
          className="size-9 rounded-[6px] text-[13px]"
        />
        <p className="min-w-0 flex-1 truncate text-[16px] font-medium leading-6 text-card-foreground">
          {borne.name}
        </p>
      </div>
    </Link>
  );
}

export function BornesGrid({ bornes }: { bornes: BorneTableRow[] }) {
  const { q, setQ, type } = useBorneFilters();
  const [layout, setLayout] = useState<LayoutMode>("grid");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return bornes.filter((b) => {
      if (type !== "all" && b.statut !== type) return false;
      if (needle.length === 0) return true;
      return b.name.toLowerCase().includes(needle) || b.subtitle.toLowerCase().includes(needle);
    });
  }, [bornes, q, type]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-9 w-[320px] items-center gap-1.5 rounded-[8px] border border-input bg-background px-3 py-1 shadow-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une borne..."
            aria-label="Rechercher"
            value={q}
            onChange={(e) => setQ(e.target.value || null)}
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-5 text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <LayoutToggle mode={layout} onChange={setLayout} />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[14px] text-muted-foreground">Aucune borne.</p>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((b) => (
            <BorneCard key={b.id} borne={b} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/parc/bornes/${b.id}`}
              className="flex items-center gap-4 rounded-[14px] border border-border bg-card px-6 py-4 shadow-sm transition-colors hover:bg-accent"
            >
              <InitialsAvatar
                name={b.name}
                logoUrl={b.logoUrl}
                className="size-9 rounded-[6px] text-[13px]"
              />
              <p className="min-w-0 flex-1 truncate text-[16px] font-medium leading-6 text-card-foreground">
                {b.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
