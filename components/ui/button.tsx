"use client";

import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils/cn";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

export type ButtonProps = Omit<React.ComponentProps<"button">, "color"> &
  ButtonVariantProps & {
    asChild?: boolean;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
    badge?: React.ReactNode;
    loading?: boolean;
  };

function Button({
  className,
  variant,
  color,
  size,
  asChild = false,
  iconStart,
  iconEnd,
  badge,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    buttonVariants({ variant, color, size }),
    loading && "opacity-[0.48]",
    className,
  );

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant ?? "primary"}
        data-color={color ?? "default"}
        data-size={size ?? "md"}
        className={classes}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      type="button"
      data-slot="button"
      data-variant={variant ?? "primary"}
      data-color={color ?? "default"}
      data-size={size ?? "md"}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" /> : iconStart}
      {children}
      {iconEnd}
      {badge}
    </button>
  );
}

export { Button };
export { buttonVariants } from "./button-variants";
