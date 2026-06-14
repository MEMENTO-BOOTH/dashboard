import { Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { KapsuleRow } from "./schemas";

function statut(borne: KapsuleRow): { dot: string; label: string } {
  if (borne.revoked) return { dot: "bg-destructive", label: "Révoquée" };
  if (borne.online) return { dot: "bg-foreground", label: "En ligne" };
  return { dot: "bg-border", label: "Hors ligne" };
}

function Row({ borne }: { borne: KapsuleRow }) {
  const état = statut(borne);
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-primary text-primary-foreground">
          <Cpu className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-semibold text-card-foreground">{borne.label}</span>
          <span className="text-xs text-muted-foreground">Version {borne.appVersion ?? "—"}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="text-xs text-muted-foreground">
          {borne.assignedOrderId ? `#${borne.assignedOrderId.slice(0, 8).toUpperCase()}` : "Libre"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <span className={`size-2 rounded-full ${état.dot}`} />
          {état.label}
        </span>
      </div>
    </div>
  );
}

export function KapsulesList({ bornes }: { bornes: KapsuleRow[] }) {
  return (
    <Card className="gap-2 py-6">
      <div className="flex flex-col gap-0.5 px-6 pb-2">
        <span className="text-lg font-semibold text-card-foreground">Bornes postales</span>
        <span className="text-sm text-muted-foreground">
          {bornes.length} borne{bornes.length > 1 ? "s" : ""} enrôlée{bornes.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-col divide-y divide-border px-6">
        {bornes.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">Aucune borne enrôlée.</p>
        ) : null}
        {bornes.map((borne) => (
          <Row key={borne.id} borne={borne} />
        ))}
      </div>
    </Card>
  );
}
