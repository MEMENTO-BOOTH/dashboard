// Figma 16482:116405 + 16482:116411 — Horizontal bar ranking card

import { formatEURCompact } from "@/lib/utils/format";
import { BorneRankingAllDialog } from "./borne-ranking-dialog";

export type RankingRow = {
  label: string;
  value: number;
};

function formatTick(n: number): string {
  return formatEURCompact(n).replace(/\s€$/, "");
}

function formatBarValue(n: number): string {
  return formatEURCompact(n);
}

function niceMax(max: number): number {
  if (max <= 0) return 100;
  const pow = 10 ** Math.floor(Math.log10(max));
  const step = max / pow;
  if (step <= 1) return pow;
  if (step <= 2) return 2 * pow;
  if (step <= 5) return 5 * pow;
  return 10 * pow;
}

const TICK_COUNT = 6;
const LABEL_WIDTH = 72;
const MIN_BAR_PCT = 8;

export function BorneRankingCard({
  title,
  subtitle,
  rows,
  allRows,
  direction,
}: {
  title: string;
  subtitle: string;
  rows: RankingRow[];
  allRows: RankingRow[];
  direction: "desc" | "asc";
}) {
  return (
    <div className="flex w-full flex-col items-stretch overflow-clip rounded-[14px] border border-border bg-card shadow-sm">
      <div className="flex items-start gap-2 border-b border-border px-6 py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[18px] font-semibold leading-7 text-card-foreground">{title}</p>
          <p className="text-[14px] font-normal leading-5 text-muted-foreground">{subtitle}</p>
        </div>
        <BorneRankingAllDialog title={title} rows={allRows} direction={direction} />
      </div>

      <div className="px-6 pt-6 pb-4">
        <RankingChart rows={rows} />
      </div>
    </div>
  );
}

export function RankingChart({ rows }: { rows: RankingRow[] }) {
  const maxValue = Math.max(...rows.map((r) => r.value), 0);
  const scaleMax = niceMax(maxValue);
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => (i / (TICK_COUNT - 1)) * scaleMax);

  return (
    <>
      <div className="relative flex flex-col gap-5">
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: LABEL_WIDTH + 8, right: 0 }}
        >
          {ticks.map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: tick position
              key={i}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${(i / (TICK_COUNT - 1)) * 100}%`,
                backgroundImage: "linear-gradient(to bottom, var(--border) 50%, transparent 50%)",
                backgroundSize: "1px 6px",
              }}
            />
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-muted-foreground">Aucune donnée.</p>
        ) : (
          rows.map((r) => {
            const pct = scaleMax > 0 ? (r.value / scaleMax) * 100 : 0;
            return (
              <div key={r.label} className="relative flex items-center gap-2">
                <p
                  className="shrink-0 truncate text-[14px] font-normal leading-5 text-card-foreground"
                  style={{ width: LABEL_WIDTH }}
                  title={r.label}
                >
                  {r.label}
                </p>
                <div className="relative flex min-w-0 flex-1">
                  <div
                    className="flex h-6 items-center overflow-clip rounded-[6px] bg-primary px-4"
                    style={{ width: `${Math.max(pct, MIN_BAR_PCT)}%` }}
                  >
                    <p className="text-[13px] font-normal leading-5 text-primary-foreground whitespace-nowrap">
                      {formatBarValue(r.value)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        className="relative mt-4 flex items-start justify-between"
        style={{ marginLeft: LABEL_WIDTH + 8 }}
      >
        {ticks.map((t) => (
          <p key={t} className="text-[12px] font-normal leading-4 text-muted-foreground">
            {formatTick(t)}
          </p>
        ))}
      </div>
    </>
  );
}
