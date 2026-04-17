import type * as React from "react";
import { cn } from "@/lib/utils/cn";

export type IconButtonGroupProps = React.ComponentProps<"div"> & {
  "aria-label": string;
};

function IconButtonGroup({ className, children, ...props }: IconButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="icon-button-group"
      className={cn(
        "inline-flex items-center overflow-clip rounded-md shadow-xs",
        "[&>*]:rounded-none [&>*]:shadow-none",
        "[&>*:first-child]:rounded-l-md",
        "[&>*:last-child]:rounded-r-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { IconButtonGroup };
