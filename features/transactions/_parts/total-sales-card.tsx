"use client";

// Figma 16516:217673 — Total sales card (340px wide)

import { CalendarRange, Clock, TrendingUp } from "lucide-react";
import { formatEUR, formatEURCompact } from "@/lib/utils/format";

const CHART_HEIGHT = 114.5;

// 12 buckets de 1h30 couvrant 9h00 → 3h00 du lendemain (cf. hourBucket dans api.ts)
const BUCKET_RANGES = [
  "09h–10h30",
  "10h30–12h",
  "12h–13h30",
  "13h30–15h",
  "15h–16h30",
  "16h30–18h",
  "18h–19h30",
  "19h30–21h",
  "21h–22h30",
  "22h30–00h",
  "00h–01h30",
  "01h30–03h",
] as const;

const AXIS_TICKS = ["09 h", "13 h", "18 h", "22 h", "03 h"];

function LineOverlay({ values }: { values: number[] }) {
  const count = values.length;
  const max = Math.max(...values, 1);
  const points = values.map((v, i) => {
    const x = (i + 0.5) / count;
    const y = 1 - v / max;
    return [x, y] as const;
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x * 100} ${y * 100}`).join(" ");
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden
    >
      <title>Courbe horaire</title>
      <path
        d={d}
        fill="none"
        stroke="var(--primary)"
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: 2 }}
      />
    </svg>
  );
}

function SplitRow({
  label,
  amount,
  highlight,
}: {
  label: string;
  amount: number;
  highlight: boolean;
}) {
  return (
    <div className="flex w-full items-center gap-3 px-6 py-1.5">
      <p
        className={`min-w-0 flex-1 text-[14px] leading-5 ${highlight ? "font-medium text-card-foreground" : "font-normal text-muted-foreground"}`}
      >
        {label}
      </p>
      <p className="text-[14px] font-medium leading-5 text-card-foreground whitespace-nowrap">
        {formatEURCompact(amount)}
      </p>
    </div>
  );
}

export function TotalSalesCard({
  totalSales,
  weekendCa,
  weekdayCa,
  hourlyBars,
}: {
  totalSales: number;
  weekendCa: number;
  weekdayCa: number;
  hourlyBars: number[];
}) {
  const maxBar = Math.max(...hourlyBars, 1);
  const peakIdx = hourlyBars.reduce(
    (acc, v, i) => (v > (hourlyBars[acc] ?? -1) ? i : acc),
    0,
  );
  const peakLabel = hourlyBars[peakIdx] && hourlyBars[peakIdx] > 0 ? BUCKET_RANGES[peakIdx] : null;

  return (
    <div className="flex w-full max-w-[340px] flex-col items-start gap-4 overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm">
      <div className="flex w-full flex-col items-start justify-center gap-2 px-6">
        <div className="flex w-full items-center gap-2">
          <div className="flex items-center rounded-[8px] bg-muted p-2">
            <TrendingUp className="size-4 text-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-[16px] font-normal leading-6 text-card-foreground">Ventes totales</p>
            <p className="text-[12px] font-normal leading-4 text-muted-foreground">
              30 derniers jours
            </p>
          </div>
        </div>
        <p className="text-[24px] font-semibold leading-8 text-card-foreground whitespace-nowrap">
          {formatEUR(totalSales)}
        </p>
      </div>

      <div className="w-full px-6">
        <div className="h-px w-full bg-border" />
      </div>

      <div className="flex w-full flex-col items-start">
        <div className="flex w-full items-center gap-2 px-6 pb-1">
          <CalendarRange className="size-3.5 text-muted-foreground" />
          <p className="text-[12px] font-normal leading-4 text-muted-foreground">
            Répartition par jour
          </p>
        </div>
        <SplitRow
          label="Weekend (Ven → Dim)"
          amount={weekendCa}
          highlight={weekendCa >= weekdayCa}
        />
        <SplitRow
          label="Semaine (Lun → Jeu)"
          amount={weekdayCa}
          highlight={weekdayCa > weekendCa}
        />
      </div>

      <div className="w-full px-6">
        <div className="h-px w-full bg-border" />
      </div>

      <div className="flex w-full flex-col items-start gap-1">
        <div className="flex w-full items-start justify-between gap-2 px-6">
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 text-muted-foreground" />
            <p className="text-[12px] font-normal leading-4 text-muted-foreground">
              Répartition horaire (9 h → 3 h)
            </p>
          </div>
          {peakLabel ? (
            <p className="text-[12px] font-medium leading-4 text-primary whitespace-nowrap">
              Pic : {peakLabel}
            </p>
          ) : null}
        </div>
        <div
          className="relative flex w-full items-end gap-[10px] px-6"
          style={{ height: CHART_HEIGHT }}
        >
          {hourlyBars.map((v, i) => {
            const h = Math.max(4, (v / maxBar) * CHART_HEIGHT);
            const isPeak = i === peakIdx && v > 0;
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed 12-bucket chart
                key={i}
                className={`min-w-px flex-1 rounded-[2px] ${isPeak ? "bg-primary" : "bg-muted"}`}
                style={{ height: h }}
                title={`${BUCKET_RANGES[i]} : ${formatEURCompact(v)}`}
              />
            );
          })}
          <div className="absolute inset-0 px-6">
            <LineOverlay values={hourlyBars} />
          </div>
        </div>
        <div className="flex w-full items-start justify-between px-6 pt-1 whitespace-nowrap">
          {AXIS_TICKS.map((t) => (
            <p key={t} className="text-[12px] font-normal leading-4 text-muted-foreground">
              {t}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
