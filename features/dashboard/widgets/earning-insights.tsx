import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EARNING_DATA, type EarningData } from "../data";
import { WidgetHeader } from "../_parts/widget-header";

// Figma 39538:1128 — Earning insights card

export function EarningInsights({ data = EARNING_DATA }: { data?: EarningData }) {
  const isNegative = data.variation.trim().startsWith("-");
  const TrendIcon = isNegative ? TrendingDown : TrendingUp;
  const badgeTone = isNegative
    ? "bg-destructive/10 text-destructive"
    : "bg-primary/10 text-primary";

  return (
    <Card className="gap-4 py-6">
      <WidgetHeader title="CA de la semaine" subtitle="Revenus des 7 derniers jours" />

      <div className="flex flex-wrap items-start gap-10">
        <div className="flex w-[330px] max-w-[330px] flex-col gap-2 p-6">
          <div className="flex w-full items-center gap-4">
            <p className="w-[166px] text-[60px] font-medium leading-none text-card-foreground">
              {data.value}
            </p>
            <span
              className={`flex h-[26px] items-center justify-center gap-1.5 rounded-[6px] px-3 py-1 ${badgeTone}`}
            >
              <TrendIcon className="size-3" />
              <span className="text-xs font-normal leading-4">{data.variation}</span>
            </span>
          </div>
          <p className="w-full text-[12px] font-normal leading-4 text-muted-foreground">
            {data.description}
          </p>
        </div>

        <div className="flex h-[150px] min-w-[270px] flex-1 items-end justify-between overflow-clip px-6">
          {data.bars.map((bar) => (
            <div
              key={bar.label}
              className="flex h-full w-6 flex-col items-center justify-end gap-2.5"
            >
              <div
                className={
                  bar.active ? "w-6 rounded-[8px] bg-primary" : "w-6 rounded-[8px] bg-primary/20"
                }
                style={{ height: `${bar.height}px` }}
              />
              <span
                className={
                  bar.active
                    ? "text-[14px] leading-5 text-primary"
                    : "text-[14px] leading-5 text-muted-foreground"
                }
              >
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
