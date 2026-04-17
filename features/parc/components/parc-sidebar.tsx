"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { parcNav } from "@/config/parc";

export function ParcSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-12 items-center border-b border-border px-4">
        <p className="text-[14px] font-semibold leading-5 text-foreground">Mon parc</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-3">
        {parcNav.flatMap((section) =>
          section.items.map((item) => {
            const isActive =
              item.href === section.href
                ? pathname.startsWith(item.href)
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mx-2 flex h-7 items-center rounded-[6px] px-3 text-[13px] transition-all",
                  isActive
                    ? "bg-foreground/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          }),
        )}
      </nav>
    </aside>
  );
}
