"use client";

import { MapPin, MonitorSmartphone } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  type InterventionMode,
  ORIGIN_LABELS,
  type Origin,
  type Priority,
  type SolutionKind,
} from "../lib";
import { ORIGIN_ICONS } from "./origin-icons";
import { PRIORITY_CLASSES } from "./priority-pill";

type Option<T extends string | number> = {
  value: T;
  label: string;
  icon?: typeof MapPin;
  pressedClass?: string;
};

function Segmented<T extends string | number>({
  options,
  value,
  onSelect,
  disabled,
}: {
  options: Option<T>[];
  value: T | null;
  onSelect: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-0.5 rounded-lg bg-muted p-[3px]">
      {options.map((o) => {
        const pressed = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={pressed}
            disabled={disabled}
            onClick={() => onSelect(o.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-foreground/60 transition-all hover:text-foreground disabled:opacity-50",
              pressed && (o.pressedClass ?? "bg-background text-foreground shadow-sm"),
            )}
          >
            {o.icon && <o.icon className="size-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function PriorityButtons({
  value,
  onChange,
  disabled,
}: {
  value: Priority;
  onChange: (p: Priority) => void;
  disabled?: boolean;
}) {
  const options = ([1, 2, 3, 4, 5] as Priority[]).map((p) => ({
    value: p,
    label: `P${p}`,
    pressedClass: cn("shadow-sm", PRIORITY_CLASSES[p]),
  }));
  return <Segmented options={options} value={value} onSelect={onChange} disabled={disabled} />;
}

export function OriginButtons({
  value,
  onChange,
  disabled,
}: {
  value: Origin;
  onChange: (o: Origin) => void;
  disabled?: boolean;
}) {
  const options = (Object.keys(ORIGIN_LABELS) as Origin[]).map((o) => ({
    value: o,
    label: ORIGIN_LABELS[o],
    icon: ORIGIN_ICONS[o],
  }));
  return <Segmented options={options} value={value} onSelect={onChange} disabled={disabled} />;
}

/** Un second clic sur le choix actif le retire. */
export function InterventionButtons({
  value,
  onChange,
  disabled,
}: {
  value: InterventionMode | null;
  onChange: (v: InterventionMode | null) => void;
  disabled?: boolean;
}) {
  const options: Option<InterventionMode>[] = [
    { value: "distance", label: "À distance", icon: MonitorSmartphone },
    { value: "surplace", label: "Sur place", icon: MapPin },
  ];
  return (
    <Segmented
      options={options}
      value={value}
      onSelect={(v) => onChange(v === value ? null : v)}
      disabled={disabled}
    />
  );
}

export function SolutionButtons({
  value,
  onChange,
  disabled,
}: {
  value: SolutionKind | null;
  onChange: (v: SolutionKind | null) => void;
  disabled?: boolean;
}) {
  const options: Option<SolutionKind>[] = [
    { value: "provisoire", label: "Provisoire" },
    { value: "definitive", label: "Définitive" },
  ];
  return (
    <Segmented
      options={options}
      value={value}
      onSelect={(v) => onChange(v === value ? null : v)}
      disabled={disabled}
    />
  );
}
