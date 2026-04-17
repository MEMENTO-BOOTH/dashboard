"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Figma 39555:122132 — Advance Tabs (grid/list toggle)
// Container: border border-input rounded-[10px] p-[3px] flex items-center
// Active: bg-input rounded-[6px] shadow-sm h-[28px] px-3 py-1
// Inactive: h-[28px] px-2 py-1

export type LayoutMode = "grid" | "list";

export function LayoutToggle({
  mode,
  onChange,
}: {
  mode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}) {
  return (
    <div className="flex items-center gap-0 overflow-clip rounded-[10px] border border-input p-[3px]">
      <button
        type="button"
        aria-label="Vue grille"
        onClick={() => onChange("grid")}
        className={cn(
          "flex h-7 items-center justify-center rounded-[6px] px-3 py-1",
          mode === "grid" && "bg-input shadow-sm",
        )}
      >
        <LayoutGrid className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Vue liste"
        onClick={() => onChange("list")}
        className={cn(
          "flex h-7 items-center justify-center rounded-[10px] px-2 py-1",
          mode === "list" && "bg-input shadow-sm",
        )}
      >
        <List className="size-4" />
      </button>
    </div>
  );
}
