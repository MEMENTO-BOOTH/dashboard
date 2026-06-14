import type { LucideIcon } from "lucide-react";
import { Cpu, Download, PackageCheck, PlugZap } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/components/ui/timeline";
import type { ActiviteEvent, ActiviteKind } from "./schemas";

const KIND_ICON: Record<ActiviteKind, LucideIcon> = {
  enroll: PlugZap,
  assign: Cpu,
  import: Download,
  return: PackageCheck,
};

export function ActiviteRecente({ events }: { events: ActiviteEvent[] }) {
  return (
    <Card className="gap-4 py-6">
      <div className="flex flex-col gap-0.5 px-6">
        <span className="text-lg font-semibold text-card-foreground">Activité récente</span>
        <span className="text-sm text-muted-foreground">Derniers événements des bornes</span>
      </div>
      <Timeline className="px-6">
        {events.map((event, i) => {
          const Icon = KIND_ICON[event.kind];
          const last = i === events.length - 1;
          return (
            <TimelineItem key={event.id} status="done" className="gap-x-4">
              <TimelineDot status="custom" className="size-9 rounded-full bg-accent">
                <Icon className="size-5 text-primary" />
              </TimelineDot>
              {last ? null : <TimelineLine className="min-h-6 bg-border" />}
              <TimelineHeading>{event.label}</TimelineHeading>
              <TimelineContent className="flex flex-col gap-0.5 pb-6">
                <span className="text-sm text-muted-foreground">{event.detail}</span>
                <span className="text-xs text-muted-foreground/70">{event.since}</span>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Card>
  );
}
