import { Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { KapsuleRow } from "@/features/kapsules";
import { AssignerButton } from "./_parts/assigner-button";
import { DetailDialog } from "./_parts/detail-dialog";
import { ExpedierButton } from "./_parts/expedier-button";
import { PhotosButton } from "./_parts/photos-button";
import { type CommandeListRow, STATUT_LABEL } from "./schemas";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RowAction({ row, bornes }: { row: CommandeListRow; bornes: KapsuleRow[] }) {
  if (row.action === "assigner") return <AssignerButton orderId={row.id} bornes={bornes} />;
  if (row.action === "expedier") return <ExpedierButton orderId={row.id} />;
  if (row.action === "envoyer_photos") return <PhotosButton token={row.returnShareToken} />;
  return null;
}

function ListRow({ row, bornes }: { row: CommandeListRow; bornes: KapsuleRow[] }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <DetailDialog row={row}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-primary text-primary-foreground">
          <Ticket className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-card-foreground">
            #{row.shortRef} · {row.clientName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {row.eventType}
            {row.eventDate ? ` · ${formatDate(row.eventDate)}` : ""}
          </span>
        </div>
      </DetailDialog>
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-foreground sm:inline-flex">
          {STATUT_LABEL[row.status]}
        </span>
        <RowAction row={row} bornes={bornes} />
      </div>
    </div>
  );
}

export function CommandesList({ rows, bornes }: { rows: CommandeListRow[]; bornes: KapsuleRow[] }) {
  return (
    <Card className="gap-2 py-6">
      <div className="flex flex-col gap-0.5 px-6 pb-2">
        <span className="text-lg font-semibold text-card-foreground">Toutes les commandes</span>
        <span className="text-sm text-muted-foreground">
          {rows.length} commande{rows.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-col divide-y divide-border px-6">
        {rows.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">Aucune commande.</p>
        ) : null}
        {rows.map((row) => (
          <ListRow key={row.id} row={row} bornes={bornes} />
        ))}
      </div>
    </Card>
  );
}
