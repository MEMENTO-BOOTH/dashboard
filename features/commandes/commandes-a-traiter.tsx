import { Ticket } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/card";

const TICKET_NOTCH: CSSProperties = {
  maskImage:
    "radial-gradient(circle 14px at 0 50%, transparent 13px, #000 14px), radial-gradient(circle 14px at 100% 50%, transparent 13px, #000 14px)",
  maskSize: "50.5% 100%",
  maskPosition: "left, right",
  maskRepeat: "no-repeat",
  WebkitMaskImage:
    "radial-gradient(circle 14px at 0 50%, transparent 13px, #000 14px), radial-gradient(circle 14px at 100% 50%, transparent 13px, #000 14px)",
  WebkitMaskSize: "50.5% 100%",
  WebkitMaskPosition: "left, right",
  WebkitMaskRepeat: "no-repeat",
};

import type { KapsuleRow } from "@/features/kapsules";
import { AssignerButton } from "./_parts/assigner-button";
import { DetailDialog } from "./_parts/detail-dialog";
import { ExpedierButton } from "./_parts/expedier-button";
import { PhotosButton } from "./_parts/photos-button";
import type { CommandeRow } from "./schemas";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RowAction({ row, bornes }: { row: CommandeRow; bornes: KapsuleRow[] }) {
  if (row.action === "assigner") return <AssignerButton orderId={row.id} bornes={bornes} />;
  if (row.action === "expedier") return <ExpedierButton orderId={row.id} />;
  return <PhotosButton token={row.returnShareToken} />;
}

function Row({ row, bornes }: { row: CommandeRow; bornes: KapsuleRow[] }) {
  return (
    <div className="flex items-center justify-between gap-3">
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
      <RowAction row={row} bornes={bornes} />
    </div>
  );
}

const MAX_VISIBLE = 5;

export function CommandesATraiter({
  rows,
  total,
  bornes,
  seeAllHref = "/commandes",
}: {
  rows: CommandeRow[];
  total: number;
  bornes: KapsuleRow[];
  seeAllHref?: string;
}) {
  const visible = rows.slice(0, MAX_VISIBLE);
  const extra = Math.max(0, total - visible.length);

  return (
    <Card className="gap-6 py-6">
      <div className="flex flex-col gap-0.5 px-6">
        <span className="text-lg font-semibold text-card-foreground">Commandes à traiter</span>
        <span className="text-sm text-muted-foreground">{total} en attente d'action</span>
      </div>

      <div className="flex flex-col gap-5 px-6">
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune commande à traiter pour le moment.</p>
        ) : null}
        {visible.map((row) => (
          <Row key={row.id} row={row} bornes={bornes} />
        ))}
      </div>

      {extra > 0 ? (
        <div className="mt-auto px-6">
          <Link
            href={seeAllHref}
            style={TICKET_NOTCH}
            className="flex h-9 w-full items-center justify-center rounded-[8px] bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir toutes les commandes (+{extra})
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
