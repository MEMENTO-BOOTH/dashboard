"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "@/components/ui/popover";

function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ActivityExportButton({ borneId }: { borneId: string }) {
  const [date, setDate] = useState<Date>(() => new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/bornes/${borneId}/activity-xlsx?date=${toYmd(date)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const disposition = res.headers.get("content-disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `activite-${toYmd(date)}.xlsx`;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
        <span className="text-[13px] font-normal leading-5 text-muted-foreground sm:mr-1">
          Exporter une journée
        </span>
        <PopoverRoot open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              iconStart={<CalendarDays className="size-4" />}
              className="min-w-[170px] justify-start font-normal capitalize"
            >
              {format(date, "EEEE d MMMM yyyy", { locale: fr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <Calendar
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
              }}
              disabled={(d) => d > new Date()}
            />
          </PopoverContent>
        </PopoverRoot>
        <Button
          onClick={handleDownload}
          loading={loading}
          iconStart={<Download className="size-4" />}
          size="sm"
        >
          Exporter Excel
        </Button>
      </div>
      {error ? (
        <p className="text-right text-[12px] text-red-600 dark:text-red-400">
          Échec de l'export. Réessaie dans un instant.
        </p>
      ) : null}
    </div>
  );
}
