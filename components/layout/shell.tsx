"use client";

import { useState } from "react";
import type { Permissions } from "@/features/auth/permissions";
import { cn } from "@/lib/utils/cn";
import { Navbar } from "./navbar";
import type { SidebarMode } from "./navbar/sidebar-mode-menu";
import { Sidebar } from "./sidebar";
import type { SidebarFooterProps } from "./sidebar/sidebar-footer";

export function Shell({
  children,
  user,
  permissions,
  incidentsP1Count,
}: {
  children: React.ReactNode;
  user: SidebarFooterProps;
  permissions: Permissions;
  incidentsP1Count?: number;
}) {
  const [mode, setMode] = useState<SidebarMode>("expanded");
  const [hovering, setHovering] = useState(false);

  const collapsed = mode === "collapsed" || (mode === "expand-on-hover" && !hovering);

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
        <Sidebar
          collapsed={collapsed}
          user={user}
          permissions={permissions}
          incidentsP1Count={incidentsP1Count}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar mode={mode} onModeChange={setMode} permissions={permissions} />
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
    </div>
  );
}
