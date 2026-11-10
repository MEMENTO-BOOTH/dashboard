"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Dialog as Primitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils/cn";

export const SheetRoot = Primitive.Root;
export const SheetTrigger = Primitive.Trigger;
export const SheetClose = Primitive.Close;
export const SheetTitle = Primitive.Title;
export const SheetDescription = Primitive.Description;

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof Primitive.Overlay>) {
  return (
    <Primitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

const sheetContentVariants = cva(
  "fixed z-50 flex flex-col gap-0 border-input bg-background shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
      },
    },
    defaultVariants: { side: "right" },
  },
);

export function SheetContent({
  className,
  children,
  side,
  ...props
}: React.ComponentProps<typeof Primitive.Content> & VariantProps<typeof sheetContentVariants>) {
  return (
    <Primitive.Portal>
      <SheetOverlay />
      <Primitive.Content className={cn(sheetContentVariants({ side }), className)} {...props}>
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1 border-b border-input p-4", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex items-center justify-between gap-2 border-t border-input p-4", className)}
      {...props}
    />
  );
}

export function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props} />;
}
