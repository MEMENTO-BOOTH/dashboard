import { AlertTriangle, CalendarClock, Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  type Column,
  formatDurationFr,
  type Incident,
  isStale,
  observationStatus,
  type Settings,
} from "../lib";

/** Bandeau d'état de la carte : hors service / surveillance / stagnation. */
export function StatusBanner({
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
  if (incident.downSince) {
    return (
      <Banner tone="destructive" icon={AlertTriangle}>
        Hors service depuis {formatDurationFr(now.getTime() - incident.downSince.getTime())}
      </Banner>
    );
  }

  const obs = observationStatus(incident, column, now);
  if (obs.state === "running") {
    return (
      <Banner tone="info" icon={Eye}>
        Surveillance : {obs.daysLeft} j restant{obs.daysLeft > 1 ? "s" : ""}
      </Banner>
    );
  }
  if (obs.state === "ready") {
    return (
      <Banner tone="success" icon={Eye}>
        Prêt à clôturer : {obs.days} j sans récidive
      </Banner>
    );
  }

  if (isStale(incident, column, now, settings)) {
    return (
      <Banner tone="warning" icon={CalendarClock}>
        Sans avancée depuis {settings.stagnationDays} j
      </Banner>
    );
  }

  if (incident.plannedAt) {
    return (
      <Banner tone="info" icon={CalendarClock}>
        Intervention prévue le {incident.plannedAt}
      </Banner>
    );
  }

  return null;
}

const TONE_CLASSES: Record<string, string> = {
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

function Banner({
  tone,
  icon: Icon,
  children,
}: {
  tone: keyof typeof TONE_CLASSES;
  icon: typeof AlertTriangle;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
