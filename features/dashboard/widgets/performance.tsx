import { ArrowDown, ChartColumnBig } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WidgetHeader } from "../_parts/widget-header";
import { PERFORMANCE_ROWS, type PerformanceRow } from "../data";

function PerfCard({ row }: { row: PerformanceRow }) {
  const Brand = row.brand;

  return (
    <div className="flex w-full flex-col gap-4 overflow-clip rounded-[14px] border border-border py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-y-2.5 px-5">
        <div className="flex min-w-[140px] flex-1 flex-col gap-1">
          <p className="text-[16px] font-normal leading-6 text-muted-foreground">{row.name}</p>
          <p className="text-[20px] font-normal leading-7 text-card-foreground">{row.value}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex size-[26px] items-center justify-center rounded-full bg-primary/10 p-2">
            <ArrowDown className="size-4 text-card-foreground" />
          </span>
          <p className="whitespace-nowrap text-[20px] font-normal leading-7 text-destructive">
            {row.percent}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 px-5">
        <button
          type="button"
          aria-label={row.name}
          className="inline-flex items-center justify-center gap-2 overflow-clip rounded-[8px] bg-primary p-1.5 text-primary-foreground"
        >
          <Brand className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function Performance({ rows = PERFORMANCE_ROWS }: { rows?: PerformanceRow[] }) {
  return (
    <Card className="gap-4 py-6">
      <WidgetHeader title="Performance" leadingIcon={<ChartColumnBig />} />
      <div className="flex flex-col gap-4 px-6">
        {rows.map((row) => (
          <PerfCard key={row.name} row={row} />
        ))}
      </div>
    </Card>
  );
}
