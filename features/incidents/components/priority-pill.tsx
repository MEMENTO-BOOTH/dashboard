import { cn } from "@/lib/utils/cn";
import { PRIORITIES, type Priority } from "../lib";

const PRIORITY_COLORS: Record<Priority, string> = {
  1: "bg-destructive/15 text-destructive",
  2: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  3: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  4: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  5: "bg-muted text-muted-foreground",
};

export function PriorityPill({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      title={PRIORITIES[priority].definition}
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-4xl px-2 text-xs font-semibold",
        PRIORITY_COLORS[priority],
        className,
      )}
    >
      P{priority}
    </span>
  );
}
