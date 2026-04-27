"use client";

import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Connection } from "../schemas";
import { ConnectionRow } from "./connection-row";

export function ConnectionsTable({ connections }: { connections: Connection[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return connections;
    return connections.filter((c) => c.borne_nom.toLowerCase().includes(needle));
  }, [connections, search]);

  return (
    <div className="flex flex-col gap-6 overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm">
      <div className="flex items-end justify-between gap-4 px-6">
        <div className="flex flex-col gap-4">
          <p className="text-[18px] font-semibold leading-[28px] text-card-foreground">
            Dernière connection aux bars
          </p>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="filter-type"
              className="text-[14px] font-medium leading-5 text-foreground"
            >
              Select type
            </label>
            <button
              type="button"
              id="filter-type"
              className="flex h-9 w-[288px] items-center justify-between gap-2 rounded-[8px] border border-input bg-background px-3 py-1 text-sm shadow-xs"
            >
              <span className="text-foreground">All</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="flex h-9 w-[288px] items-center gap-1.5 rounded-[8px] border border-input bg-background px-3 py-1 shadow-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Type to search..."
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 font-normal text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid h-14 grid-cols-[1fr_160px_40px] items-center border-t border-border px-6">
            <div className="text-[14px] font-medium leading-5 text-muted-foreground">Borne</div>
            <div className="text-[14px] font-medium leading-5 text-muted-foreground">
              Dernière connexion
            </div>
            <div />
          </div>
          {filtered.length === 0 ? (
            <div className="flex h-14 items-center border-t border-border px-6 text-[14px] text-muted-foreground">
              Aucune connexion.
            </div>
          ) : (
            filtered.map((c) => <ConnectionRow key={c.id} c={c} />)
          )}
        </div>
      </div>
    </div>
  );
}
