// Figma 16482:126733 — KPI card "Profit"

function buildPoints(values: number[]): [number, number][] {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const n = values.length;
  return values.map((v, i) => {
    const x = n === 1 ? 50 : (i / (n - 1)) * 100;
    const y = 100 - ((v - min) / range) * 90 - 5;
    return [x, y];
  });
}

function LineChart({ values }: { values: number[] }) {
  const POINTS = buildPoints(values);
  const d = POINTS.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      aria-hidden
    >
      <title>Profit chart</title>
      <path
        d={d}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="0.6"
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: 2 }}
      />
      {POINTS.map(([x, y], i) => {
        const isLast = i === POINTS.length - 1;
        return (
          <g key={`${x}-${y}`}>
            {isLast ? (
              <circle
                cx={x}
                cy={y}
                r={2.4}
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 2 }}
              />
            ) : null}
            <circle cx={x} cy={y} r={1.2} fill="var(--primary)" vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
    </svg>
  );
}

function DashedGrid() {
  const lines = [0, 20, 40, 60, 80, 100];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      aria-hidden
    >
      <title>Grid</title>
      {lines.map((x) => (
        <line
          key={x}
          x1={x}
          y1={0}
          x2={x}
          y2={100}
          stroke="var(--border)"
          strokeWidth="0.4"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 1 }}
        />
      ))}
    </svg>
  );
}

import { formatEURCompact, formatTrend } from "@/lib/utils/format";

export function ProfitCard({
  caLastMonth,
  trend,
  lineData,
}: {
  caLastMonth: number;
  trend: number | null;
  lineData: number[];
}) {
  return (
    <div className="flex h-full w-full flex-col items-start gap-4 overflow-clip rounded-[14px] border border-border bg-card py-6 shadow-sm">
      <div className="flex w-full flex-col items-start gap-1">
        <div className="flex w-full items-center px-6">
          <p className="min-w-0 flex-1 text-[18px] font-semibold leading-7 text-card-foreground">
            Chiffre d'affaires
          </p>
        </div>
        <div className="flex w-full items-center px-6">
          <p className="min-w-0 flex-1 text-[16px] font-normal leading-6 text-muted-foreground">
            Mois dernier
          </p>
        </div>
      </div>

      <div className="relative min-h-[120px] w-full flex-1 px-6">
        <div className="relative size-full">
          <DashedGrid />
          <LineChart values={lineData.length > 0 ? lineData : [0, 0]} />
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-6">
        <p className="min-w-0 flex-1 text-[20px] font-semibold leading-7 text-card-foreground">
          {formatEURCompact(caLastMonth)}
        </p>
        <p
          className={`text-[16px] font-normal leading-6 whitespace-nowrap ${
            trend === null
              ? "text-muted-foreground"
              : trend >= 0
                ? "text-success"
                : "text-destructive"
          }`}
        >
          {formatTrend(trend)}
        </p>
      </div>
    </div>
  );
}
