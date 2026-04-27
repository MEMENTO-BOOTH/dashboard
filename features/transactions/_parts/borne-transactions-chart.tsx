"use client";

// Figma 39551:18018 — Compound card "Total Transaction + Report" for a specific borne

import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { formatEURCompact, formatTrend } from "@/lib/utils/format";

type Row = { label: string; ca: number };
type Period = "month" | "week";

function TotalTransactionSection({
  rows,
  period,
  onPeriod,
}: {
  rows: Row[];
  period: Period;
  onPeriod: (p: Period) => void;
}) {
  const max = Math.max(...rows.map((m) => m.ca), 1);
  const maxIdx = rows.reduce((acc, m, i) => (m.ca === max ? i : acc), 0);
  const subtitle =
    period === "month"
      ? rows.length >= 8
        ? "8 derniers mois complets"
        : `${rows.length} mois disponibles`
      : rows.length >= 8
        ? "8 dernières semaines complètes"
        : `${rows.length} semaines disponibles`;

  return (
    <div className="flex min-w-[280px] flex-1 flex-col items-start justify-between self-stretch">
      <div className="flex w-full items-start justify-between px-6">
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <p className="text-[18px] font-semibold leading-7 text-card-foreground">
            Chiffre d'affaires
          </p>
          <p className="text-[14px] font-normal leading-5 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-[10px] border border-input bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => onPeriod("month")}
              className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium leading-4 transition-colors ${
                period === "month"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mois
            </button>
            <button
              type="button"
              onClick={() => onPeriod("week")}
              className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium leading-4 transition-colors ${
                period === "week"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semaine
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 items-end gap-[14px] px-6">
        {rows.map((m, i) => {
          const height = Math.max(20, (m.ca / max) * 240);
          const isMax = i === maxIdx;
          return (
            <div
              key={`${period}-${m.label}-${i}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <p className="w-full text-center text-[16px] font-semibold leading-6 text-card-foreground">
                {formatEURCompact(m.ca)}
              </p>
              <div
                className={`w-full rounded-[10px] ${isMax ? "bg-primary" : "bg-primary/20"}`}
                style={{ height }}
              />
              <p className="w-full text-center text-[14px] font-normal leading-5 text-card-foreground">
                {m.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReportPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[8px] px-2 py-2">
      <div className="relative size-12">
        <div className="absolute inset-0 rounded-[6px] bg-primary/10" />
        <div className="absolute inset-0 flex items-center justify-center text-foreground">
          {icon}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-1 whitespace-nowrap text-center">
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">{label}</p>
        <p className="text-[20px] font-medium leading-7 text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

function trendIcon(n: number | null) {
  if (n === null || n >= 0) return <TrendingUp className="size-6" />;
  return <TrendingDown className="size-6" />;
}

function ReportSection({
  period,
  lastWeekCa,
  lastMonthCa,
  trendWeek,
  trendMonth,
}: {
  period: Period;
  lastWeekCa: number;
  lastMonthCa: number;
  trendWeek: number | null;
  trendMonth: number | null;
}) {
  const subtitle =
    period === "month"
      ? `Mois dernier : ${formatEURCompact(lastMonthCa)}`
      : `Semaine dernière : ${formatEURCompact(lastWeekCa)}`;

  return (
    <div className="flex h-[384px] w-[340px] max-w-[340px] min-w-[320px] shrink-0 flex-col gap-8 px-6">
      <div className="flex w-full items-start">
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <p className="text-[18px] font-semibold leading-7 text-card-foreground">Synthèse</p>
          <p className="text-[14px] font-normal leading-5 text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <ReportPill
          icon={trendIcon(trendWeek)}
          label="Semaine dernière"
          value={formatTrend(trendWeek)}
        />
        <div className="h-[176px] w-px shrink-0 bg-border" />
        <ReportPill
          icon={trendIcon(trendMonth)}
          label="Mois dernier"
          value={formatTrend(trendMonth)}
        />
      </div>
    </div>
  );
}

export function BorneTransactionsChart({
  months,
  weeks,
  trendWeek,
  trendMonth,
  lastWeekCa,
  lastMonthCa,
}: {
  months: Row[];
  weeks: Row[];
  trendWeek: number | null;
  trendMonth: number | null;
  lastWeekCa: number;
  lastMonthCa: number;
}) {
  const [period, setPeriod] = useState<Period>("month");
  const rows = period === "month" ? months : weeks;

  return (
    <div className="flex items-start gap-4 overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm">
      <TotalTransactionSection rows={rows} period={period} onPeriod={setPeriod} />
      <div className="h-[336px] w-px self-center bg-border" />
      <ReportSection
        period={period}
        lastWeekCa={lastWeekCa}
        lastMonthCa={lastMonthCa}
        trendWeek={trendWeek}
        trendMonth={trendMonth}
      />
    </div>
  );
}
