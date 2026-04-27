// Figma 39551:18132 — adapté au CA moyen par période depuis l'installation

import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { formatEUR } from "@/lib/utils/format";
import type { AvgCaBucket } from "../api";

const COLORS = ["bg-primary", "bg-muted", "bg-muted-foreground/60"];

export function BorneVisitorsBreakdown({
  caTotal,
  buckets,
}: {
  caTotal: number;
  buckets: AvgCaBucket[];
}) {
  const maxAmount = Math.max(...buckets.map((b) => b.amount), 1);

  return (
    <div className="flex w-full flex-col gap-5 rounded-[14px] border border-border bg-card p-6 shadow-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-[8px] bg-muted text-foreground">
            <Wallet className="size-4" />
          </div>
          <p className="text-[16px] font-normal leading-6 text-card-foreground">
            CA total depuis la 1ʳᵉ transaction
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-[28px] font-semibold leading-9 text-card-foreground">
          {formatEUR(caTotal)}
        </p>
      </div>

      <div className="h-px w-full bg-border" />

      <div className="relative grid grid-cols-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px"
          style={{
            left: "33.333%",
            backgroundImage: "linear-gradient(to bottom, var(--border) 50%, transparent 50%)",
            backgroundSize: "1px 6px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px"
          style={{
            left: "66.666%",
            backgroundImage: "linear-gradient(to bottom, var(--border) 50%, transparent 50%)",
            backgroundSize: "1px 6px",
          }}
        />

        {buckets.map((b, i) => {
          const prev = i > 0 ? (buckets[i - 1]?.amount ?? 0) : b.amount;
          const up = b.amount >= prev;
          const height = Math.max(20, (b.amount / maxAmount) * 120);
          return (
            <div key={b.label} className="flex flex-col items-center gap-3 px-2">
              <div className="flex flex-col items-center gap-1">
                <p className="text-[14px] font-normal leading-5 text-muted-foreground">{b.label}</p>
                <p className="text-[22px] font-semibold leading-7 text-card-foreground">
                  {formatEUR(b.amount)}
                </p>
              </div>
              <div className="flex h-[120px] w-full items-end justify-center">
                <div
                  className={`w-full rounded-[14px] ${COLORS[i] ?? "bg-muted"}`}
                  style={{ height }}
                />
              </div>
              <div className="flex w-full items-center justify-between pt-2">
                <p className="text-[12px] font-normal leading-4 text-muted-foreground">Moyenne</p>
                {up ? (
                  <ArrowUpRight className="size-4 text-foreground" />
                ) : (
                  <ArrowDownLeft className="size-4 text-foreground" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
