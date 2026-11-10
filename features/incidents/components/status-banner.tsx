import { AlertTriangle, CalendarClock, Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  type Column,
  formatDurationFr,
  formatPlannedDate,
  type Incident,
  isFinalRole,
  isStale,
  observationStatus,
  type Settings,
} from "../lib";

type Tone = "destructive" | "warning" | "info" | "success";
type BannerSpec = { key: string; tone: Tone; icon: typeof AlertTriangle; label: string };

/** Bandeaux d'état applicables à un incident, cumulables (RG-08/RG-10). */
export function statusBanners(
  incident: Incident,
  column: Column,
  settings: Settings,
  now: Date,
): BannerSpec[] {
  const banners: BannerSpec[] = [];
  const isOpen = !isFinalRole(column.role);
  const obs = observationStatus(incident, column, now);

  if (obs.state === "running") {
    banners.push({
      key: "obs",
      tone: "info",
      icon: Eye,
      label: `Surveillance en cours · J-${obs.daysLeft}`,
    });
  } else if (obs.state === "ready") {
    banners.push({
      key: "obs",
      tone: "success",
      icon: Eye,
      label: `Prêt à clôturer · aucune récidive en ${obs.days} j`,
    });
  }

  if (incident.downSince && isOpen) {
    banners.push({
      key: "down",
      tone: "destructive",
      icon: AlertTriangle,
      label: `Hors service depuis ${formatDurationFr(now.getTime() - incident.downSince.getTime())}`,
    });
  }

  if (incident.plannedAt && isOpen && column.role !== "observation") {
    banners.push({
      key: "planned",
      tone: "info",
      icon: CalendarClock,
      label: `Intervention prévue le ${formatPlannedDate(incident.plannedAt)}`,
    });
  }

  if (isStale(incident, column, now, settings)) {
    banners.push({
      key: "stale",
      tone: "warning",
      icon: CalendarClock,
      label: `Sans avancée depuis ${settings.stagnationDays} j`,
    });
  }

  return banners;
}

const TONE_CLASSES: Record<Tone, string> = {
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
};

export function StatusBanners({
  incident,
  column,
  settings,
  now,
}: {
  incident: Incident;
  column: Column;
  settings: Settings;
  now: Date;
}) {
  const banners = statusBanners(incident, column, settings, now);
  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {banners.map(({ key, tone, icon: Icon, label }) => (
        <div
          key={key}
          className={cn(
            "flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-[13px] font-medium leading-5",
            TONE_CLASSES[tone],
          )}
        >
          <Icon className="size-3.5 shrink-0" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
