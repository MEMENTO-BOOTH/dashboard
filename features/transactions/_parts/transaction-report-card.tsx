// Figma 16531:250898 — Compound card: Total Transaction + vertical separator + Report

import { TrendingDown, TrendingUp } from "lucide-react";
import { formatEURCompact, formatTrend } from "@/lib/utils/format";

type MonthRow = { month: string; ca: number };

function TotalTransactionSection({ months }: { months: MonthRow[] }) {
  const max = Math.max(...months.map((m) => m.ca), 1);
  const maxIdx = months.reduce((acc, m, i) => (m.ca === max ? i : acc), 0);
  const subtitle =
    months.length >= 8 ? "8 derniers mois complets" : `${months.length} mois disponibles`;

  return (
    <div className="flex min-w-[280px] flex-1 flex-col items-start justify-between self-stretch">
      <div className="flex w-full items-start px-6">
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <p className="text-[18px] font-semibold leading-7 text-card-foreground">
            Chiffre d'affaires mensuel
          </p>
          <p className="text-[14px] font-normal leading-5 text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex w-full flex-1 items-end gap-[14px] px-6">
        {months.map((m, i) => {
          const height = Math.max(20, (m.ca / max) * 240);
          const isMax = i === maxIdx;
          return (
            <div
              key={`${m.month}-${i}`}
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
                {m.month}
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
  refLabel,
  prevLabel,
  value,
}: {
  icon: React.ReactNode;
  refLabel: string;
  prevLabel: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[8px] px-3 py-2">
      <div className="relative size-12">
        <div className="absolute inset-0 rounded-[6px] bg-primary/10" />
        <div className="absolute inset-0 flex items-center justify-center text-foreground">
          {icon}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-0.5 whitespace-nowrap text-center">
        <p className="text-[13px] font-medium leading-5 text-card-foreground">{refLabel}</p>
        <p className="text-[12px] font-normal leading-4 text-muted-foreground">vs {prevLabel}</p>
        <p className="mt-1 text-[20px] font-medium leading-7 text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

function trendIcon(n: number | null) {
  if (n === null || n >= 0) return <TrendingUp className="size-6" />;
  return <TrendingDown className="size-6" />;
}

function ReportSection({
  lastMonthCa,
  trendWeek,
  trendMonth,
  weekRefLabel,
  weekPrevLabel,
  monthRefLabel,
  monthPrevLabel,
}: {
  lastMonthCa: number;
  trendWeek: number | null;
  trendMonth: number | null;
  weekRefLabel: string;
  weekPrevLabel: string;
  monthRefLabel: string;
  monthPrevLabel: string;
}) {
  return (
    <div className="flex h-[384px] w-[340px] max-w-[340px] min-w-[320px] shrink-0 flex-col gap-8 px-6">
      <div className="flex w-full items-start">
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <p className="text-[18px] font-semibold leading-7 text-card-foreground">Évolution</p>
          <p className="text-[14px] font-normal leading-5 text-muted-foreground">
            {monthRefLabel} : {formatEURCompact(lastMonthCa)}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <ReportPill
          icon={trendIcon(trendWeek)}
          refLabel={weekRefLabel}
          prevLabel={weekPrevLabel}
          value={formatTrend(trendWeek)}
        />
        <div className="h-[176px] w-px bg-border" />
        <ReportPill
          icon={trendIcon(trendMonth)}
          refLabel={monthRefLabel}
          prevLabel={monthPrevLabel}
          value={formatTrend(trendMonth)}
        />
      </div>
    </div>
  );
}

export function TransactionReportCard({
  months,
  trendWeek,
  trendMonth,
  lastMonthCa,
  weekRefLabel,
  weekPrevLabel,
  monthRefLabel,
  monthPrevLabel,
}: {
  months: MonthRow[];
  trendWeek: number | null;
  trendMonth: number | null;
  lastMonthCa: number;
  weekRefLabel: string;
  weekPrevLabel: string;
  monthRefLabel: string;
  monthPrevLabel: string;
}) {
  return (
    <div className="flex items-start gap-4 overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm">
      <TotalTransactionSection months={months} />
      <div className="h-[336px] w-px self-center bg-border" />
      <ReportSection
        lastMonthCa={lastMonthCa}
        trendWeek={trendWeek}
        trendMonth={trendMonth}
        weekRefLabel={weekRefLabel}
        weekPrevLabel={weekPrevLabel}
        monthRefLabel={monthRefLabel}
        monthPrevLabel={monthPrevLabel}
      />
    </div>
  );
}
