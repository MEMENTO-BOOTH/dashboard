"use client";

import { useId, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDays } from "@/lib/utils/format";
import { ActivityExportButton } from "./activity-export-button";

// Numéro de semaine ISO calculé en UTC pour éviter les sauts de DST.
function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-S${String(week).padStart(2, "0")}`;
}

type PaperHistoryEntry = {
  feuilles_restantes: number;
  recorded_at: string;
};

const PERIODS = [
  { label: "7 jours", days: 7, groupBy: "day" as const },
  { label: "30 jours", days: 30, groupBy: "day" as const },
  { label: "3 mois", days: 90, groupBy: "week" as const },
  { label: "12 mois", days: 365, groupBy: "month" as const },
];

function SegmentedGauge({ percent }: { percent: number }) {
  const gradId = useId();
  return (
    <div className="relative h-[132px] w-[150px] text-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="150"
        height="132"
        viewBox="0 0 150 132"
        fill="none"
        className="absolute inset-0"
        aria-hidden
      >
        <title>Niveau de papier</title>
        <path
          d="M141.206 74.5835C141.206 63.3798 138.38 52.3571 132.989 42.5357C127.598 32.7142 119.817 24.4114 110.365 18.3957C100.914 12.38 90.097 8.84577 78.9169 8.12014C67.7367 7.39451 56.5541 9.50094 46.4042 14.2445C36.2542 18.988 27.4648 26.2153 20.8496 35.2575C14.2343 44.2997 10.007 54.8645 8.55878 65.9742C7.11058 77.0839 8.48832 88.3794 12.5645 98.8153C16.6407 109.251 23.2836 118.49 31.8783 125.677"
          stroke={`url(#${gradId})`}
          strokeWidth="16"
          strokeDasharray="6 6"
        />
        <defs>
          <linearGradient
            id={gradId}
            x1="141.206"
            y1="56.9803"
            x2="-29.3968"
            y2="155.98"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[24px] font-semibold leading-8 text-card-foreground">{percent}%</p>
        <p className="text-[14px] font-normal leading-5 text-muted-foreground">restant</p>
      </div>
    </div>
  );
}

type BarData = { label: string; current: number; previous: number };

function formatLabel(key: string, groupBy: "day" | "week" | "month"): string {
  if (groupBy === "day") {
    const d = new Date(`${key}T12:00:00`);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  }
  if (groupBy === "week") {
    return key.split("-")[1] ?? key;
  }
  const d = new Date(`${key}-01`);
  return d.toLocaleDateString("fr-FR", { month: "short" });
}

function getKey(date: Date, groupBy: "day" | "week" | "month"): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  if (groupBy === "day") return `${y}-${m}-${d}`;
  if (groupBy === "month") return `${y}-${m}`;
  return isoWeekKey(date);
}

function addStep(date: Date, groupBy: "day" | "week" | "month"): Date {
  const d = new Date(date);
  if (groupBy === "day") d.setDate(d.getDate() + 1);
  else if (groupBy === "week") d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

function levelsByKey(entries: PaperHistoryEntry[], groupBy: "day" | "week" | "month") {
  const sorted = [...entries].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));
  const map = new Map<string, number>();
  for (const e of sorted) {
    const key = getKey(new Date(e.recorded_at), groupBy);
    map.set(key, e.feuilles_restantes);
  }
  return map;
}

function buildBars(
  history: PaperHistoryEntry[],
  periodDays: number,
  groupBy: "day" | "week" | "month",
): BarData[] {
  const now = new Date();
  const currentStart = addDays(now, -periodDays);
  const previousStart = addDays(currentStart, -periodDays);

  const currentEntries = history.filter(
    (h) => new Date(h.recorded_at).getTime() >= currentStart.getTime(),
  );
  const previousEntries = history.filter((h) => {
    const t = new Date(h.recorded_at).getTime();
    return t >= previousStart.getTime() && t < currentStart.getTime();
  });

  const currentMap = levelsByKey(currentEntries, groupBy);
  const previousMap = levelsByKey(previousEntries, groupBy);

  // Fill forward missing dates with the last known value
  const bars: BarData[] = [];
  let cursor = new Date(currentStart);
  let lastCurrent = 0;
  let lastPrevious = 0;
  let guard = 0;

  while (cursor.getTime() <= now.getTime() && guard < 400) {
    const currentKey = getKey(cursor, groupBy);
    const previousCursor = addDays(cursor, -periodDays);
    const previousKey = getKey(previousCursor, groupBy);

    const currentVal = currentMap.get(currentKey);
    if (currentVal !== undefined) lastCurrent = currentVal;
    const previousVal = previousMap.get(previousKey);
    if (previousVal !== undefined) lastPrevious = previousVal;

    bars.push({
      label: formatLabel(currentKey, groupBy),
      current: lastCurrent,
      previous: lastPrevious,
    });

    cursor = addStep(cursor, groupBy);
    guard += 1;
  }

  return bars;
}

const MAX_FEUILLES = 400;

function BarChart({ bars }: { bars: BarData[] }) {
  if (bars.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-[14px] text-muted-foreground">
        Les données apparaîtront au fil des jours.
      </div>
    );
  }

  // Transform previous to NEGATIVE to render bars pointing down
  const data = bars.map((b) => ({ label: b.label, current: b.current, previous: -b.previous }));

  return (
    <div className="h-[280px] px-6">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 8, left: 0 }}
          stackOffset="sign"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={40}
            domain={[-MAX_FEUILLES, MAX_FEUILLES]}
            ticks={[-MAX_FEUILLES, -200, 0, 200, MAX_FEUILLES]}
            tickFormatter={(v: number) => Math.abs(v).toString()}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.3 }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "13px",
              color: "var(--popover-foreground)",
            }}
            labelStyle={{ color: "var(--popover-foreground)", fontWeight: 500 }}
            formatter={(value, name) => [
              `${Math.abs(Number(value))} feuilles`,
              name === "current" ? "Période courante" : "Période précédente",
            ]}
          />
          <Bar dataKey="current" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar
            dataKey="previous"
            fill="var(--primary)"
            fillOpacity={0.2}
            radius={[0, 0, 4, 4]}
            maxBarSize={24}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PaperUsageSection({
  borneId,
  feuilles,
  max,
  history,
}: {
  borneId: string;
  feuilles: number;
  max: number;
  history: PaperHistoryEntry[];
}) {
  const percent = Math.round((feuilles / max) * 100);
  const [periodIdx, setPeriodIdx] = useState(0);
  const period = PERIODS[periodIdx] ?? { label: "7 jours", days: 7, groupBy: "day" as const };

  const bars = useMemo(
    () => buildBars(history, period.days, period.groupBy),
    [history, period.days, period.groupBy],
  );

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">Utilisation papier</h2>

      <div className="flex flex-col overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3 px-6">
            <div className="flex flex-col gap-1">
              <p className="text-[18px] font-semibold leading-[28px] text-card-foreground">
                Niveau de papier
              </p>
              <p className="text-[14px] font-normal leading-5 text-muted-foreground">
                Feuilles restantes par{" "}
                {period.groupBy === "day" ? "jour" : period.groupBy === "week" ? "semaine" : "mois"}
                . Le rouleau plein contient {MAX_FEUILLES} feuilles.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-primary" />
                <span className="text-[13px] font-normal leading-4 text-muted-foreground">
                  Période actuelle
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-primary/20" />
                <span className="text-[13px] font-normal leading-4 text-muted-foreground">
                  Période précédente (comparaison)
                </span>
              </div>
            </div>
          </div>

          <BarChart bars={bars} />
        </div>

        <div className="h-px bg-border lg:h-auto lg:w-px" />

        <div className="flex shrink-0 flex-col items-center justify-center gap-6 px-6 py-6 lg:w-[250px] lg:py-0">
          <select
            value={periodIdx}
            onChange={(e) => setPeriodIdx(Number(e.target.value))}
            className="h-8 w-[140px] rounded-[8px] border border-input bg-background px-2.5 text-[12px] font-normal leading-4 text-muted-foreground shadow-xs outline-none"
          >
            {PERIODS.map((p, i) => (
              <option key={p.label} value={i}>
                {p.label}
              </option>
            ))}
          </select>

          <SegmentedGauge percent={percent} />

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">Aujourd'hui</p>
            <p className="text-[24px] font-semibold leading-8 text-card-foreground">
              {feuilles}{" "}
              <span className="text-[14px] font-normal text-muted-foreground">/ {max}</span>
            </p>
          </div>
        </div>
      </div>

      <ActivityExportButton borneId={borneId} />

      <div className="h-px bg-border" />
    </div>
  );
}
