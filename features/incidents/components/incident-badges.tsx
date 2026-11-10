import { Layers, Repeat, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  type Column,
  type Incident,
  isRecurrent,
  ORIGIN_LABELS,
  type Settings,
  seriesSize,
} from "../lib";
import { ORIGIN_ICONS } from "./origin-icons";

/** Badges d'une carte/fiche : origine, revenu, récurrent, série, provisoire, occurrences. */
export function IncidentBadges({
  incident,
  allIncidents,
  columnsById,
  settings,
  className,
}: {
  incident: Incident;
  allIncidents: readonly Incident[];
  columnsById: ReadonlyMap<string, Column>;
  settings: Settings;
  className?: string;
}) {
  const series = seriesSize(incident, allIncidents, columnsById);
  const recurrent = isRecurrent(incident, settings);
  const OriginIcon = ORIGIN_ICONS[incident.origin];

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <Badge variant="secondary" title="Origine de la panne">
        <OriginIcon />
        {ORIGIN_LABELS[incident.origin]}
      </Badge>
      {incident.returned && (
        <Badge variant="destructive" title="Le signal est revenu après correction">
          <RotateCcw />
          Revenu
        </Badge>
      )}
      {recurrent && (
        <Badge
          variant="outline"
          className="border-warning/40 text-warning"
          title="Plusieurs épisodes sur cette borne"
        >
          <Repeat />
          Récurrent · {incident.episodes}× en {settings.recidiveWindowDays} j
        </Badge>
      )}
      {series > 0 && (
        <Badge
          variant="outline"
          className="border-info/40 text-info"
          title="Le même signal est ouvert sur plusieurs bornes"
        >
          <Layers />
          Série · {series} bornes
        </Badge>
      )}
      {incident.solution === "provisoire" && (
        <Badge variant="outline" title="Contournement : récidive probable">
          Provisoire
        </Badge>
      )}
      {incident.occurrences > 1 && (
        <Badge variant="outline" title="Nombre de fois où le signal est remonté">
          ×{incident.occurrences}
        </Badge>
      )}
    </div>
  );
}
