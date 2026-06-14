"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatEURCompact, formatPct } from "@/lib/utils/format";
import { WidgetHeader } from "../_parts/widget-header";
import { EARNING_DATA, type EarningBar, type EarningData } from "../data";

// Figma 39538:1128 — Earning insights card

const formatEUR = formatEURCompact;

function BarTooltip({ bar }: { bar: EarningBar }) {
  const positive = bar.changePct >= 0;

  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[8px] border border-border bg-popover px-3 py-2 text-[12px] leading-4 shadow-md">
      <p className="font-semibold text-popover-foreground">
        {bar.fullLabel}
        {bar.active ? " · aujourd'hui" : bar.future ? " · à venir" : ""}
      </p>
      {bar.future ? (
        <>
          <p className="mt-1 text-muted-foreground">
            Cette semaine :{" "}
            <span className="font-medium text-muted-foreground">pas encore arrivé</span>
          </p>
          <p className="text-muted-foreground">
            Semaine passée :{" "}
            <span className="font-medium text-popover-foreground">
              {formatEUR(bar.amountLastWeek)}
            </span>
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-muted-foreground">
            Cette semaine :{" "}
            <span className="font-medium text-popover-foreground">{formatEUR(bar.amount)}</span>
          </p>
          <p className="text-muted-foreground">
            Semaine passée :{" "}
            <span className="font-medium text-popover-foreground">
              {formatEUR(bar.amountLastWeek)}
            </span>
          </p>
          {bar.amountLastWeek > 0 || bar.amount > 0 ? (
            <p className={`mt-1 font-medium ${positive ? "text-success" : "text-destructive"}`}>
              {formatPct(bar.changePct)} vs semaine passée
            </p>
          ) : null}
        </>
      )}
      <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r border-b border-border bg-popover" />
    </div>
  );
}

function Bar({
  bar,
  maxHeight,
  maxAmount,
}: {
  bar: EarningBar;
  maxHeight: number;
  maxAmount: number;
}) {
  const [hovered, setHovered] = useState(false);
  const height = maxAmount > 0 ? Math.max(4, (bar.amount / maxAmount) * maxHeight) : 4;
  const highlight = bar.active || hovered;

  let barClass: string;
  if (bar.future) {
    barClass = "w-6 rounded-[8px] border border-dashed border-primary/30 bg-transparent";
  } else if (highlight) {
    barClass = "w-6 rounded-[8px] bg-primary transition-colors";
  } else {
    barClass = "w-6 rounded-[8px] bg-primary/20 transition-colors";
  }

  return (
    <button
      type="button"
      aria-label={`${bar.fullLabel} : ${formatEUR(bar.amount)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative flex h-full w-6 flex-col items-center justify-end gap-2.5 outline-none"
    >
      <div className={barClass} style={{ height: bar.future ? Math.max(16, height) : height }} />
      <span
        className={`text-[14px] leading-5 transition-colors ${
          bar.future
            ? "text-muted-foreground/60"
            : highlight
              ? "text-primary"
              : "text-muted-foreground"
        }`}
      >
        {bar.label}
      </span>
      {hovered ? <BarTooltip bar={bar} /> : null}
    </button>
  );
}

export function EarningInsights({ data = EARNING_DATA }: { data?: EarningData }) {
  const maxAmount = useMemo(() => Math.max(...data.bars.map((b) => b.amount), 1), [data.bars]);

  const isNegative = data.variationPct < 0;
  const TrendIcon = isNegative ? TrendingDown : TrendingUp;
  const badgeTone = isNegative
    ? "bg-destructive/10 text-destructive"
    : "bg-success/10 text-success";

  const diff = data.totalThisWeek - data.totalLastWeek;
  const diffLabel =
    data.totalLastWeek === 0
      ? "Pas de comparable la semaine passée."
      : diff >= 0
        ? `+${formatEUR(diff)} vs même tronçon semaine passée`
        : `${formatEUR(diff)} vs même tronçon semaine passée`;

  return (
    <Card className="gap-4 py-6">
      <WidgetHeader title="CA de la semaine" subtitle="Semaine en cours (lundi → aujourd'hui)" />

      <div className="flex flex-col items-stretch gap-6 px-6">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[48px] font-medium leading-[56px] text-card-foreground">
              {formatEUR(data.totalThisWeek)}
            </p>
            <span
              className={`inline-flex h-[26px] items-center justify-center gap-1.5 rounded-[6px] px-3 py-1 ${badgeTone}`}
            >
              <TrendIcon className="size-3" />
              <span className="text-[12px] font-medium leading-4">
                {formatPct(data.variationPct)}
              </span>
            </span>
          </div>
          <p className="text-[13px] font-normal leading-5 text-muted-foreground">{diffLabel}</p>
        </div>

        <div className="flex h-[150px] min-w-0 flex-1 items-end justify-between gap-2">
          {data.bars.map((bar) => (
            <Bar key={bar.label} bar={bar} maxHeight={120} maxAmount={maxAmount} />
          ))}
        </div>
      </div>
    </Card>
  );
}
