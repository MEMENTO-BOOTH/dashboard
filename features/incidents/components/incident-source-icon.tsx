import { Store, User } from "lucide-react";
import { AlertBadge } from "@/features/dashboard/alerts";
import type { Incident } from "../lib";

/** Pastille du dashboard pour un signal, ou boîte d'icône neutre pour un incident saisi. */
export function IncidentSourceIcon({
  incident,
  size = 36,
}: {
  incident: Pick<Incident, "source" | "signalType">;
  size?: number;
}) {
  if (incident.source === "auto" && incident.signalType) {
    return <AlertBadge type={incident.signalType} size={size} />;
  }
  const Icon = incident.source === "bar" ? Store : User;
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-clip rounded-[6px]"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-primary opacity-10" />
      <Icon className="text-primary" style={{ width: size / 2, height: size / 2 }} aria-hidden />
    </div>
  );
}
