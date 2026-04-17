"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

// Figma 39589:2796 Submenu wrapper — verbatim:
// "content-stretch flex gap-[0px] items-center px-[14px] py-[0px]
//  relative rounded-[6px] shrink-0 w-full"
//
// 39589:2797 Inner (with left border):
// "border-[var(--border,#e5e5e5)] border-l border-solid
//  content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start
//  min-h-px min-w-px px-[10px] py-[2px] relative"
//
// 39589:2798 Submenu item (h-28):
// "content-stretch flex flex-col h-[28px] items-start justify-center
//  px-[8px] relative rounded-[8px] shrink-0 w-full"
// Text: font 'Inter:Regular' 400, leading-[20px], text-[14px]

export type SubmenuItem = { href: string; label: string };

export function SidebarSubmenu({ items }: { items: SubmenuItem[] }) {
  const pathname = usePathname();
  return (
    <div className="flex w-full items-center gap-0 rounded-[6px] px-[14px] py-0 group-data-[collapsed]/sidebar:hidden">
      <div className="flex min-w-0 flex-1 flex-col gap-1 border-l border-border px-[10px] py-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive || undefined}
              className={cn(
                "flex h-7 w-full flex-col items-start justify-center rounded-[8px] px-2",
                "text-[14px] leading-5 font-normal text-sidebar-foreground",
                "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "data-[active]:bg-sidebar-accent data-[active]:font-medium",
              )}
            >
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
