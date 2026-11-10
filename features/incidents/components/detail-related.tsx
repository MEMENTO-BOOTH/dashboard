import type { IncidentBorne } from "../api";
import {
  type Column,
  formatDurationFr,
  formatWhen,
  type Incident,
  isRecurrent,
  type Settings,
  type SignalRule,
} from "../lib";
import { IncidentSourceIcon } from "./incident-source-icon";
import { PriorityPill } from "./priority-pill";

const SOURCE_LABELS: Record<Incident["source"], string> = {
  auto: "Signal automatique du dashboard",
  bar: "Signalé par le bar (QR code sur la borne)",
  manuel: "Créé à la main",
};

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[16px] font-semibold leading-6 text-card-foreground">{children}</h3>;
}

export function DetailSignalBlock({
  incident,
  signalRules,
  settings,
  isOpen,
}: {
  incident: Incident;
  signalRules: readonly SignalRule[];
  settings: Settings;
  isOpen: boolean;
}) {
  const now = new Date();
  const rule = incident.signalType
    ? signalRules.find((r) => r.signalType === incident.signalType)
    : undefined;
  const recurrent = isRecurrent(incident, settings);

  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>Signal</SectionTitle>
      <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-6 gap-y-2 text-[14px] leading-5">
        <Row label="Source">{SOURCE_LABELS[incident.source]}</Row>
        <Row label="Signal">{rule ? rule.label : "Aucun"}</Row>
        <Row label="Occurrences">
          {incident.occurrences} fois
          {incident.occurrences > 1 ? ", regroupées sur cette carte" : ""}
        </Row>
        <Row label="Première fois">{formatWhen(incident.firstSeenAt, now)}</Row>
        <Row label="Dernière fois">{formatWhen(incident.lastSeenAt, now)}</Row>
        <Row label={`Épisodes en ${settings.recidiveWindowDays} j`}>
          {incident.episodes}
          {recurrent ? " · récurrent" : ""}
        </Row>
        {incident.downSince && isOpen && (
          <Row label="Hors service">
            depuis {formatDurationFr(now.getTime() - incident.downSince.getTime())}
          </Row>
        )}
      </dl>
      {incident.description && (
        <p className="rounded-[10px] border border-border bg-muted/40 px-4 py-3 text-[14px] leading-5 whitespace-pre-wrap text-card-foreground">
          {incident.description}
        </p>
      )}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-card-foreground [overflow-wrap:anywhere]">{children}</dd>
    </>
  );
}

export function DetailRelatedBlock({
  borne,
  related,
  columnsById,
  onSelect,
}: {
  borne: IncidentBorne | undefined;
  related: readonly Incident[];
  columnsById: ReadonlyMap<string, Column>;
  onSelect: (incidentId: string) => void;
}) {
  const now = new Date();
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle>
        {borne ? `Borne ${borne.code} · 30 derniers jours` : "30 derniers jours"}
      </SectionTitle>
      {related.length === 0 && (
        <p className="text-[14px] leading-5 text-muted-foreground">
          Aucun autre incident sur cette borne ces 30 derniers jours.
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {related.map((incident) => (
          <li key={incident.id}>
            <button
              type="button"
              onClick={() => onSelect(incident.id)}
              className="flex w-full items-center gap-3 rounded-[10px] border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-muted/40"
            >
              <IncidentSourceIcon incident={incident} size={32} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14px] font-medium leading-5 text-card-foreground">
                  {incident.title}
                </span>
                <span className="truncate text-[13px] leading-5 text-muted-foreground">
                  {columnsById.get(incident.columnId)?.name ?? ""} ·{" "}
                  {formatWhen(incident.createdAt, now)}
                </span>
              </span>
              <PriorityPill priority={incident.priority} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
