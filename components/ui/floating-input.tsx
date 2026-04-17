"use client";

import type * as React from "react";
import { cn } from "@/lib/utils/cn";

// Exact Figma v5 specs (nodes 4119:7647, 4119:7723)
// Wrapper: h-[38px] relative
// Shell: absolute inset-x-0 top-0 flex h-9 items-center gap-1.5 px-3.5 py-1.5 rounded-md border bg-white shadow-xs
// Label pill (optional): absolute left-2 -top-2 bg-card px-1 text-xs/16 — cuts through border
// Top right: flex-1 text-right text-xs/16 opacity-80 inside Top overlay at top-[-24px]
// Bottom: absolute top-[38px] left-0 w-full p-1 text-xs/16 opacity-80

type State = "default" | "focus" | "success" | "destructive";
type Size = "sm" | "md" | "lg";
type Shape = "rounded" | "round";

export type FloatingInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  label?: string;
  topRightLabel?: React.ReactNode;
  bottomText?: React.ReactNode;
  bottomRightText?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  state?: State;
  shape?: Shape;
  size?: Size;
  wrapperClassName?: string;
};

const sizeMap: Record<Size, { wrap: string; input: string; pad: string }> = {
  sm: { wrap: "h-[34px]", input: "h-8", pad: "px-3 py-1" },
  md: { wrap: "h-[38px]", input: "h-9", pad: "px-3.5 py-1.5" },
  lg: { wrap: "h-[42px]", input: "h-10", pad: "px-3.5 py-1.5" },
};

const stateShell: Record<State, string> = {
  default:
    "shadow-xs border-input focus-within:border-ring focus-within:shadow-[0_0_0_3px_rgb(161_161_170/0.5)]",
  focus: "border-ring shadow-[0_0_0_3px_rgb(161_161_170/0.5)] overflow-clip",
  success: "shadow-xs border-success overflow-clip",
  destructive: "shadow-xs border-destructive overflow-clip",
};

const stateLabel: Record<State, string> = {
  default: "text-muted-foreground",
  focus: "text-muted-foreground",
  success: "text-success",
  destructive: "text-destructive",
};

const stateTopRight: Record<State, string> = {
  default: "text-muted-foreground opacity-80",
  focus: "text-muted-foreground opacity-80",
  success: "text-success opacity-80",
  destructive: "text-destructive opacity-80",
};

function FloatingInput({
  className,
  wrapperClassName,
  label,
  topRightLabel,
  bottomText,
  bottomRightText,
  leftIcon,
  rightIcon,
  state = "default",
  shape = "rounded",
  size = "md",
  id,
  disabled,
  ...props
}: FloatingInputProps) {
  const s = sizeMap[size];
  const radius = shape === "round" ? "rounded-full" : "rounded-[8px]";
  const hasTop = label || topRightLabel;

  return (
    <div className={cn("w-full", disabled && "opacity-50", wrapperClassName)}>
      <div className={cn("relative w-full", s.wrap)}>
        <div
          className={cn(
            "absolute inset-x-0 top-0 flex w-full items-center gap-1.5 bg-background border",
            radius,
            s.input,
            s.pad,
            stateShell[state],
          )}
        >
          {leftIcon ? (
            <span className="shrink-0 text-foreground [&_svg]:size-4">{leftIcon}</span>
          ) : null}
          <input
            id={id}
            data-slot="floating-input"
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm leading-5 font-normal text-foreground",
              "placeholder:text-muted-foreground outline-none",
              "text-ellipsis whitespace-nowrap disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
          {rightIcon ? (
            <span className="shrink-0 text-foreground [&_svg]:size-4">{rightIcon}</span>
          ) : null}
        </div>

        {hasTop ? (
          <div className="pointer-events-none absolute -top-6 left-0 flex w-full items-center justify-between p-1">
            {topRightLabel ? (
              <p
                className={cn(
                  "flex-1 text-right text-xs font-normal leading-4",
                  stateTopRight[state],
                )}
              >
                {topRightLabel}
              </p>
            ) : (
              <span className="flex-1" />
            )}
            {label ? (
              <label
                htmlFor={id}
                className={cn(
                  "absolute left-2 top-4 flex items-center bg-card px-1 text-xs font-normal leading-4",
                  stateLabel[state],
                )}
              >
                {label}
              </label>
            ) : null}
          </div>
        ) : null}

        {bottomText || bottomRightText ? (
          <div className="pointer-events-none absolute top-[38px] left-0 flex w-full items-start justify-between p-1">
            {bottomText ? (
              <p className="flex-1 text-xs font-normal leading-4 text-muted-foreground opacity-80">
                {bottomText}
              </p>
            ) : (
              <span className="flex-1" />
            )}
            {bottomRightText ? (
              <p className="text-xs font-normal leading-4 text-right text-muted-foreground opacity-80">
                {bottomRightText}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { FloatingInput };
