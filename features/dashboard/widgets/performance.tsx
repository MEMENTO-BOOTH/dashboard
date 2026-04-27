import { ArrowDown, ArrowUp, CalendarRange, ChartColumnBig } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WidgetHeader } from "../_parts/widget-header";
import { PERFORMANCE_ROWS, type PerformanceRow } from "../data";

// Les valeurs (montant + %) sont pré-formatées côté server (formatEUR / formatPct).

function PerfCard({ row }: { row: PerformanceRow }) {
  const Brand = row.brand;
  const positive = row.deltaPct >= 0;
  const Arrow = positive ? ArrowUp : ArrowDown;
  const percentClass = positive ? "text-success" : "text-destructive";

  return (
    <div className="flex w-full flex-col gap-4 overflow-clip rounded-[14px] border border-border py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-y-2.5 px-5">
        <div className="flex min-w-[140px] flex-1 flex-col gap-1">
          <p className="text-[16px] font-normal leading-6 text-muted-foreground">{row.name}</p>
          <p className="text-[20px] font-normal leading-7 text-card-foreground">{row.value}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex size-[26px] items-center justify-center rounded-full bg-primary/10 p-2">
            <Arrow className="size-4 text-card-foreground" />
          </span>
          <p className={`whitespace-nowrap text-[20px] font-normal leading-7 ${percentClass}`}>
            {row.percent}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 px-5">
        <button
          type="button"
          aria-label={row.name}
          className="relative inline-flex size-7 items-center justify-center gap-2 overflow-clip rounded-[8px] bg-primary p-1.5 text-primary-foreground"
        >
          {row.logoUrl ? (
            // biome-ignore lint/performance/noImgElement: avatar
            <img src={row.logoUrl} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <Brand className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export function Performance({
  rows = PERFORMANCE_ROWS,
  refRange,
  prevRange,
}: {
  rows?: PerformanceRow[];
  refRange?: string;
  prevRange?: string;
}) {
  return (
    <Card className="gap-4 py-6">
      <WidgetHeader title="Performance" leadingIcon={<ChartColumnBig />} />
      <div className="flex flex-col gap-4 px-6">
        {rows.map((row) => (
          <PerfCard key={row.id} row={row} />
        ))}
      </div>
      {refRange && prevRange ? (
        <div className="flex items-center gap-2 border-t border-border px-6 pt-4 text-[12px] font-normal leading-4 text-muted-foreground">
          <CalendarRange className="size-3.5 shrink-0" />
          <p>
            Semaine <span className="font-medium text-foreground">{refRange}</span> comparée à la
            semaine <span className="font-medium text-foreground">{prevRange}</span>
          </p>
        </div>
      ) : null}
    </Card>
  );
}
