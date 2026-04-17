"use client";

import type * as React from "react";
import { cn } from "@/lib/utils/cn";
import { inputShellVariants, type InputShellVariantProps } from "./input-variants";

export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  InputShellVariantProps & {
    label?: React.ReactNode;
    topRightLabel?: React.ReactNode;
    bottomText?: React.ReactNode;
    bottomRightText?: React.ReactNode;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    wrapperClassName?: string;
  };

function Input({
  className,
  wrapperClassName,
  shape,
  state,
  size,
  label,
  topRightLabel,
  bottomText,
  bottomRightText,
  leftIcon,
  rightIcon,
  disabled,
  id,
  ...props
}: InputProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-0", disabled && "opacity-50", wrapperClassName)}
    >
      {(label || topRightLabel) && (
        <div className="flex items-center justify-between p-1">
          {label ? (
            <label
              htmlFor={id}
              className="flex-1 text-sm font-medium leading-5 text-foreground"
            >
              {label}
            </label>
          ) : (
            <span className="flex-1" />
          )}
          {topRightLabel ? (
            <span
              className={cn(
                "text-xs font-normal leading-4 text-right",
                state === "success" && "text-success opacity-80",
                state === "destructive" && "text-destructive opacity-80",
                state !== "success" &&
                  state !== "destructive" &&
                  "text-muted-foreground opacity-80",
              )}
            >
              {topRightLabel}
            </span>
          ) : null}
        </div>
      )}

      <div
        className={cn(
          inputShellVariants({ shape, state, size }),
          disabled && "bg-[rgb(71_72_87/0.1)]",
        )}
      >
        {leftIcon ? (
          <span className="shrink-0 text-foreground [&_svg]:size-4">{leftIcon}</span>
        ) : null}
        <input
          id={id}
          data-slot="input"
          disabled={disabled}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-sm leading-5 font-normal text-foreground",
            "placeholder:text-muted-foreground outline-none",
            "text-ellipsis whitespace-nowrap",
            "disabled:cursor-not-allowed",
            "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            className,
          )}
          {...props}
        />
        {rightIcon ? (
          <span className="shrink-0 text-foreground [&_svg]:size-4">{rightIcon}</span>
        ) : null}
      </div>

      {(bottomText || bottomRightText) && (
        <div className="flex items-start justify-between gap-2 p-1">
          {bottomText ? (
            <p className="text-xs font-normal leading-4 text-muted-foreground opacity-80">
              {bottomText}
            </p>
          ) : (
            <span />
          )}
          {bottomRightText ? (
            <p className="text-xs font-normal leading-4 text-right text-muted-foreground opacity-80">
              {bottomRightText}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export { Input };
