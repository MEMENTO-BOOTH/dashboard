"use client";

import type * as React from "react";
import { cn } from "@/lib/utils/cn";
import { iconButtonVariants, type IconButtonVariantProps } from "./icon-button-variants";

export type IconButtonProps = Omit<React.ComponentProps<"button">, "color"> &
  IconButtonVariantProps & {
    "aria-label": string;
  };

function IconButton({
  className,
  variant,
  color,
  size,
  shape,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      data-slot="icon-button"
      data-variant={variant ?? "solid"}
      data-color={color ?? "default"}
      data-size={size ?? "md"}
      data-shape={shape ?? "square"}
      className={cn(iconButtonVariants({ variant, color, size, shape }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { IconButton };
