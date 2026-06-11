"use client";

import { addDays, addMonths, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const WEEKDAYS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

type CalendarProps = {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
};

export function Calendar({ selected, onSelect, disabled }: CalendarProps) {
  const [month, setMonth] = useState<Date>(() => startOfMonth(selected ?? new Date()));

  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  return (
    <div className="w-[280px] select-none">
      <div className="mb-3 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setMonth(subMonths(month, 1))}
          className="flex size-8 items-center justify-center rounded-[8px] text-muted-foreground outline-none hover:bg-muted"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-[14px] font-semibold capitalize text-foreground">
          {format(month, "MMMM yyyy", { locale: fr })}
        </span>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          className="flex size-8 items-center justify-center rounded-[8px] text-muted-foreground outline-none hover:bg-muted"
          aria-label="Mois suivant"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            className="flex h-8 items-center justify-center text-[11px] font-medium uppercase text-muted-foreground"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isOutside = !isSameMonth(day, month);
          const isDisabled = disabled?.(day) ?? false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(day)}
              className={cn(
                "flex h-9 items-center justify-center rounded-[8px] text-[13px] font-normal outline-none transition-colors",
                "hover:bg-muted",
                isOutside && "text-muted-foreground/40",
                !isOutside && "text-foreground",
                isToday(day) && !isSelected && "font-semibold text-primary",
                isSelected && "bg-primary font-semibold text-primary-foreground hover:bg-primary",
                isDisabled && "pointer-events-none opacity-30",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
