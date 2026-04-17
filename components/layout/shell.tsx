"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Navbar } from "./navbar";
import type { SidebarMode } from "./navbar/sidebar-mode-menu";
import { Sidebar } from "./sidebar";

export function Shell({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<SidebarMode>("expanded");
  const [hovering, setHovering] = useState(false);

  const collapsed =
    mode === "collapsed" || (mode === "expand-on-hover" && !hovering);

  return (
    <div className="flex h-screen w-full items-stretch overflow-hidden bg-background">
      <div
        onMouseEnter={() => mode === "expand-on-hover" && setHovering(true)}
        onMouseLeave={() => mode === "expand-on-hover" && setHovering(false)}
        className={cn(
          "h-full shrink-0 overflow-hidden transition-[width] duration-200",
          collapsed ? "w-[64px]" : "w-[260px]",
        )}
      >
        <Sidebar collapsed={collapsed} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar mode={mode} onModeChange={setMode} />
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
    </div>
  );
}
