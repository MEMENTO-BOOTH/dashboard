"use client";

import { EllipsisVertical } from "lucide-react";
import { useMemo, useState } from "react";

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
  return (
    <div className="relative h-[132px] w-[150px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="150" height="132" viewBox="0 0 150 132" fill="none" className="absolute inset-0" aria-hidden>
        <path d="M141.206 74.5835C141.206 63.3798 138.38 52.3571 132.989 42.5357C127.598 32.7142 119.817 24.4114 110.365 18.3957C100.914 12.38 90.097 8.84577 78.9169 8.12014C67.7367 7.39451 56.5541 9.50094 46.4042 14.2445C36.2542 18.988 27.4648 26.2153 20.8496 35.2575C14.2343 44.2997 10.007 54.8645 8.55878 65.9742C7.11058 77.0839 8.48832 88.3794 12.5645 98.8153C16.6407 109.251 23.2836 118.49 31.8783 125.677" stroke="url(#paint0_linear_39651_2627)" strokeWidth="16" strokeDasharray="6 6" />
        <defs>
          <linearGradient id="paint0_linear_39651_2627" x1="141.206" y1="56.9803" x2="-29.3968" y2="155.98" gradientUnits="userSpaceOnUse">
            <stop stopColor="#171717" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
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

function groupByDay(entries: PaperHistoryEntry[]): Map<string, number[]> {
  const map = new Map<string, number[]>();
  for (const e of entries) {
    const key = e.recorded_at.slice(0, 10);
    const arr = map.get(key) ?? [];
    arr.push(e.feuilles_restantes);
    map.set(key, arr);
  }
  return map;
}

function getWeekKey(iso: string): string {
  const d = new Date(iso);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-S${String(week).padStart(2, "0")}`;
}

function getMonthKey(iso: string): string {
  return iso.slice(0, 7);
}

function computeConsumption(
  entries: PaperHistoryEntry[],
  groupBy: "day" | "week" | "month",
): Map<string, number> {
  const sorted = [...entries].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));
  const result = new Map<string, number>();

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!;
    const curr = sorted[i]!;
    const diff = prev.feuilles_restantes - curr.feuilles_restantes;
    const consumption = Math.max(0, diff);

    let key: string;
    if (groupBy === "day") key = curr.recorded_at.slice(0, 10);
    else if (groupBy === "week") key = getWeekKey(curr.recorded_at);
    else key = getMonthKey(curr.recorded_at);

    result.set(key, (result.get(key) ?? 0) + consumption);
  }

  return result;
}

function formatLabel(key: string, groupBy: "day" | "week" | "month"): string {
  if (groupBy === "day") {
    const d = new Date(key);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  }
  if (groupBy === "week") {
    return key.split("-")[1] ?? key;
  }
  const d = new Date(`${key}-01`);
  return d.toLocaleDateString("fr-FR", { month: "short" });
}

function buildBars(
  history: PaperHistoryEntry[],
  periodDays: number,
  groupBy: "day" | "week" | "month",
): BarData[] {
  const now = Date.now();
  const currentStart = now - periodDays * 86400000;
  const previousStart = currentStart - periodDays * 86400000;

  const currentEntries = history.filter((h) => {
    const t = new Date(h.recorded_at).getTime();
    return t >= currentStart;
  });

  const previousEntries = history.filter((h) => {
    const t = new Date(h.recorded_at).getTime();
    return t >= previousStart && t < currentStart;
  });

  const currentMap = computeConsumption(currentEntries, groupBy);
  const previousMap = computeConsumption(previousEntries, groupBy);

  const allKeys = new Set([...currentMap.keys(), ...previousMap.keys()]);
  const sortedKeys = [...allKeys].sort();

  return sortedKeys.map((key) => ({
    label: formatLabel(key, groupBy),
    current: currentMap.get(key) ?? 0,
    previous: previousMap.get(key) ?? 0,
  }));
}

function BarChart({ bars }: { bars: BarData[] }) {
  if (bars.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-[14px] text-muted-foreground">
        Les données apparaîtront au fil des jours.
      </div>
    );
  }

  const maxVal = Math.max(...bars.flatMap((b) => [b.current, b.previous]), 1);
  const BAR_HEIGHT = 100;

  return (
    <div className="flex h-[250px] flex-col px-6">
      <div className="flex flex-1">
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center justify-center">
            <div className="flex flex-1 items-end">
              <div
                className="w-3 rounded-t-full bg-primary"
                style={{ height: `${(b.current / maxVal) * BAR_HEIGHT}px` }}
              />
            </div>
            <div className="flex flex-1 items-start">
              <div
                className="w-3 rounded-b-full bg-primary/20"
                style={{ height: `${(b.previous / maxVal) * BAR_HEIGHT}px` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex pt-2">
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 justify-center">
            <span className="text-[12px] font-normal leading-4 text-muted-foreground">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaperUsageSection({
  feuilles,
  max,
  history,
}: {
  feuilles: number;
  max: number;
  history: PaperHistoryEntry[];
}) {
  const percent = Math.round((feuilles / max) * 100);
  const [periodIdx, setPeriodIdx] = useState(0);
  const period = PERIODS[periodIdx]!;

  const bars = useMemo(
    () => buildBars(history, period.days, period.groupBy),
    [history, period.days, period.groupBy],
  );

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 pt-12">
      <h2 className="text-[24px] font-semibold leading-8 text-foreground">Utilisation papier</h2>

      <div className="flex overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-start justify-between px-6">
            <div className="flex flex-col gap-2">
              <p className="text-[18px] font-semibold leading-[28px] text-card-foreground">
                Consommation
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-primary" />
                  <span className="text-[14px] font-normal leading-5 text-muted-foreground">
                    Période courante
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-primary/20" />
                  <span className="text-[14px] font-normal leading-5 text-muted-foreground">
                    Période précédente
                  </span>
                </div>
              </div>
            </div>
            <button type="button" aria-label="More" className="text-muted-foreground hover:text-foreground">
              <EllipsisVertical className="size-4" />
            </button>
          </div>

          <BarChart bars={bars} />
        </div>

        <div className="w-px self-stretch bg-border" />

        <div className="flex w-[250px] shrink-0 flex-col items-center justify-center gap-6 px-6">
          <select
            value={periodIdx}
            onChange={(e) => setPeriodIdx(Number(e.target.value))}
            className="h-8 w-[140px] rounded-[8px] border border-input bg-background px-2.5 text-[12px] font-normal leading-4 text-muted-foreground shadow-xs outline-none"
          >
            {PERIODS.map((p, i) => (
              <option key={p.label} value={i}>{p.label}</option>
            ))}
          </select>

          <SegmentedGauge percent={percent} />

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">Aujourdhui</p>
            <p className="text-[24px] font-semibold leading-8 text-card-foreground">
              {feuilles} <span className="text-[14px] font-normal text-muted-foreground">/ {max}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />
    </div>
  );
}
