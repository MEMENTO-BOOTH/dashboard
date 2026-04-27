"use client";

import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BORNE_TYPE_LABELS, BORNE_TYPE_VALUES, useBorneFilters } from "../hooks/use-borne-filters";

export function TableHeader() {
  const { q, setQ, type, setType } = useBorneFilters();

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-6">
        <h2 className="text-[18px] font-semibold leading-[28px] text-card-foreground">
          Mes bornes
        </h2>
      </div>
      <div className="flex items-end justify-between gap-4 px-6 pb-6 pt-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[14px] font-medium leading-5 text-foreground">Select type</p>
          <DropdownMenuRoot>
            <DropdownMenuTrigger
              type="button"
              className="flex h-9 w-[288px] items-center justify-between gap-2 rounded-[8px] border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus:ring-2 focus:ring-ring"
            >
              <span className="text-foreground">{BORNE_TYPE_LABELS[type]}</span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[288px]">
              <DropdownMenuRadioGroup
                value={type}
                onValueChange={(v) => setType(v as (typeof BORNE_TYPE_VALUES)[number])}
              >
                {BORNE_TYPE_VALUES.map((v) => (
                  <DropdownMenuRadioItem key={v} value={v}>
                    {BORNE_TYPE_LABELS[v]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenuRoot>
        </div>
        <div className="flex h-[36px] w-[288px] items-center gap-1.5 rounded-[8px] border border-input bg-background px-3 py-1 shadow-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Type to search..."
            aria-label="Search"
            value={q}
            onChange={(e) => setQ(e.target.value || null)}
            className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 font-normal text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}
