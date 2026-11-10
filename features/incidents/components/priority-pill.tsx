import { cn } from "@/lib/utils/cn";
import { PRIORITIES, type Priority } from "../lib";

export const PRIORITY_CLASSES: Record<Priority, string> = {
  1: "bg-destructive text-white",
  2: "bg-warning text-white",
  3: "bg-primary/10 text-primary",
  4: "bg-secondary text-secondary-foreground",
  5: "bg-muted text-muted-foreground",
};

export function PriorityPill({
  priority,
  withName = false,
  className,
}: {
  priority: Priority;
  withName?: boolean;
  className?: string;
}) {
  return (
    <span
      title={PRIORITIES[priority].definition}
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-4xl px-2 text-xs font-medium tabular-nums",
        PRIORITY_CLASSES[priority],
        className,
      )}
    >
      P{priority}
      {withName && ` · ${PRIORITIES[priority].name}`}
    </span>
  );
}
