"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

// Figma 39589:2778 List Item — verbatim:
// "content-stretch flex gap-[8px] items-center p-[8px]
//  relative rounded-[8px] shrink-0 w-full"
//
// Icon: size-[16px] shrink-0
// Text (39589:2781): font 'Inter:Regular' 400, leading-[20px], text-[14px]
//   text-[color:var(--sidebar-foreground,#404040)] w-full
// Chevron: size-[16px]; right=ChevronRight; down=ChevronDown (per vector insets)

export type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  indicator?: "right" | "down";
  badge?: number;
};

export function SidebarItem({ href, icon, label, indicator, badge }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      data-active={isActive || undefined}
      title={label}
      className={cn(
        "flex w-full items-center gap-2 rounded-[8px] p-2",
        "text-[14px] leading-5 font-normal text-sidebar-foreground",
        "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "data-[active]:bg-sidebar-accent data-[active]:font-medium data-[active]:text-sidebar-accent-foreground",
        "group-data-[collapsed]/sidebar:justify-center",
      )}
    >
      <span className="shrink-0 [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 flex-1 truncate group-data-[collapsed]/sidebar:hidden">{label}</span>
      {Boolean(badge) && (
        <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground tabular-nums group-data-[collapsed]/sidebar:hidden">
          {badge}
        </span>
      )}
      {indicator === "right" ? (
        <ChevronRight className="size-4 shrink-0 opacity-60 group-data-[collapsed]/sidebar:hidden" />
      ) : null}
      {indicator === "down" ? (
        <ChevronDown className="size-4 shrink-0 opacity-60 group-data-[collapsed]/sidebar:hidden" />
      ) : null}
    </Link>
  );
}
