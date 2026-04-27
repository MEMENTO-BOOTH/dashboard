"use client";

import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Figma 16482:115896 "Weekly overview" mini chart for "Voir le CA"
// Eye-off icon for "Cacher le CA"

function MiniChart() {
  const heights = [40, 56, 30, 72, 60, 48, 28];
  return (
    <svg viewBox="0 0 140 80" className="h-[80px] w-full" aria-hidden>
      <title>Aperçu CA</title>
      {heights.map((h, i) => (
        <rect
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed bars
          key={i}
          x={6 + i * 19}
          y={78 - h}
          width={14}
          height={h}
          rx={6}
          fill={i === 3 ? "currentColor" : "var(--muted)"}
        />
      ))}
    </svg>
  );
}

function ToggleCard({
  selected,
  onClick,
  title,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3 rounded-[10px] border p-4 transition-all",
        selected
          ? "border-primary bg-accent ring-2 ring-primary"
          : "border-input bg-background hover:bg-accent",
      )}
    >
      <div className="flex h-[80px] w-full items-center justify-center text-foreground">
        {children}
      </div>
      <span className="text-[14px] font-medium leading-5 text-foreground">{title}</span>
    </button>
  );
}

export function CaToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] font-medium leading-5 text-foreground">
        Accès au chiffre d'affaires
      </span>
      <div className="flex gap-3">
        <ToggleCard selected={value} onClick={() => onChange(true)} title="Voir le CA">
          <MiniChart />
        </ToggleCard>
        <ToggleCard selected={!value} onClick={() => onChange(false)} title="Cacher le CA">
          <EyeOff className="size-10 text-muted-foreground" strokeWidth={1.5} />
        </ToggleCard>
      </div>
    </div>
  );
}
