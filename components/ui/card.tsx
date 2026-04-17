import type * as React from "react";
import { cn } from "@/lib/utils/cn";

// Figma v5 Card primitive:
// bg-card border border-border rounded-[14px] shadow-sm overflow-clip
// shadow exact: 0_1px_3px_0_rgba(0,0,0,0.1), 0_1px_2px_-1px_rgba(0,0,0,0.1)

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col overflow-clip rounded-[14px] border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
