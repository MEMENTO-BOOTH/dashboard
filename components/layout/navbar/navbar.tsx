"use client";

import { NavbarActions } from "./navbar-actions";
import { NavbarSearch } from "./navbar-search";
import { type SidebarMode, SidebarModeMenu } from "./sidebar-mode-menu";

export function Navbar({
  mode,
  onModeChange,
}: {
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex w-full items-center gap-4 border-b border-border bg-background px-4 py-2">
      <SidebarModeMenu mode={mode} onModeChange={onModeChange} />
      <div className="h-4 w-px shrink-0 bg-border" />
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-4">
        <NavbarSearch />
        <div className="flex flex-1 items-center justify-end gap-4">
          <NavbarActions />
        </div>
      </div>
    </header>
  );
}
