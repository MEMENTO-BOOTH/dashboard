"use client";

import { Toggle as Primitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Toggle({
  className,
  size = "md",
  ...props
}: React.ComponentProps<typeof Primitive.Root> & { size?: "sm" | "md" }) {
  return (
    <Primitive.Root
      data-slot="toggle"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background font-medium text-foreground shadow-xs transition-colors",
        "hover:bg-muted",
        "data-[state=on]:border-primary/20 data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
        size === "sm" ? "h-8 px-3 text-sm" : "h-9 px-4 text-sm",
        className,
      )}
      {...props}
    />
  );
}
