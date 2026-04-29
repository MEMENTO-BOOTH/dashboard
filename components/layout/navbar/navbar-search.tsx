"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import type { Permissions } from "@/features/auth/permissions";
import { CommandPalette } from "./command-palette";

export function NavbarSearch({ permissions }: { permissions: Permissions }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir la recherche"
        className="flex h-[36px] w-[288px] shrink-0 cursor-text items-center gap-1.5 rounded-[8px] bg-background px-3 py-1 text-left shadow-xs outline-none focus:ring-2 focus:ring-ring"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 text-[14px] leading-5 font-normal text-muted-foreground">
          Type to search...
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} permissions={permissions} />
    </>
  );
}
