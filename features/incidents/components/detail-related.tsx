import type { IncidentBorne } from "../api";
import type { Incident } from "../lib";
import { PriorityPill } from "./priority-pill";

export function DetailSignalBlock({ incident }: { incident: Incident }) {
  if (!incident.signalType) return null;
  return (
    <div className="rounded-md border border-input bg-muted/40 p-3 text-sm">
      <p className="text-xs font-medium text-muted-foreground">Signal</p>
      <p className="font-mono text-xs text-foreground">{incident.signalType}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {incident.occurrences} occurrence{incident.occurrences > 1 ? "s" : ""} · {incident.episodes}{" "}
        épisode{incident.episodes > 1 ? "s" : ""}
      </p>
    </div>
  );
}

export function DetailRelatedBlock({
  borne,
  related,
}: {
  borne: IncidentBorne | undefined;
  related: readonly Incident[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-foreground">
        {borne ? `${borne.code} · 30 derniers jours` : "30 derniers jours"}
      </h3>
      {related.length === 0 && (
        <p className="text-xs text-muted-foreground">Aucun autre incident sur cette borne.</p>
      )}
      <div className="flex flex-col gap-1.5">
        {related.map((incident) => (
          <div
            key={incident.id}
            className="flex items-center gap-2 rounded-md border border-input bg-background p-2 text-xs"
          >
            <PriorityPill priority={incident.priority} />
            <span className="truncate text-foreground">{incident.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
