"use client";

import { PanelLeft } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";

export type SidebarMode = "expanded" | "collapsed" | "expand-on-hover";

export const SIDEBAR_MODES: { value: SidebarMode; label: string }[] = [
  { value: "expanded", label: "Expanded" },
  { value: "collapsed", label: "Collapsed" },
  { value: "expand-on-hover", label: "Expand on hover" },
];

export function SidebarModeMenu({
  mode,
  onModeChange,
}: {
  mode: SidebarMode;
  onModeChange: (mode: SidebarMode) => void;
}) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <IconButton variant="ghost" size="md" aria-label="Sidebar control">
          <PanelLeft className="!size-5" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8}>
        <DropdownMenuLabel>Sidebar control</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={mode} onValueChange={(v) => onModeChange(v as SidebarMode)}>
          {SIDEBAR_MODES.map((m) => (
            <DropdownMenuRadioItem key={m.value} value={m.value}>
              {m.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
