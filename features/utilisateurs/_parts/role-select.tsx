"use client";

import { cn } from "@/lib/utils/cn";

export type RoleOption = { slug: string; name: string };

export function RoleSelect({
  value,
  onChange,
  roles,
}: {
  value: string;
  onChange: (slug: string) => void;
  roles: RoleOption[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] font-medium leading-5 text-foreground">Rôle</span>
      <div className="flex flex-wrap items-center gap-1 rounded-[10px] border border-input bg-muted/40 p-1">
        {roles.map((r) => {
          const selected = value === r.slug;
          return (
            <button
              key={r.slug}
              type="button"
              onClick={() => onChange(r.slug)}
              aria-pressed={selected}
              className={cn(
                "flex h-8 min-w-[100px] flex-1 items-center justify-center rounded-[6px] px-3 text-[13px] font-medium leading-5 transition-all",
                selected
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
