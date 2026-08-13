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
};

export function SidebarItem({ href, icon, label, indicator }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      data-active={isActive || undefined}
      title={label}
      className={cn(
        "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5",
        "text-[15px] leading-6 font-normal text-sidebar-foreground",
        "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "data-[active]:bg-sidebar-accent data-[active]:font-medium data-[active]:text-sidebar-accent-foreground",
        "group-data-[collapsed]/sidebar:justify-center",
      )}
    >
      <span className="shrink-0 [&_svg]:size-5">{icon}</span>
      <span className="min-w-0 flex-1 truncate group-data-[collapsed]/sidebar:hidden">{label}</span>
      {indicator === "right" ? (
        <ChevronRight className="size-5 shrink-0 opacity-60 group-data-[collapsed]/sidebar:hidden" />
      ) : null}
      {indicator === "down" ? (
        <ChevronDown className="size-5 shrink-0 opacity-60 group-data-[collapsed]/sidebar:hidden" />
      ) : null}
    </Link>
  );
}
