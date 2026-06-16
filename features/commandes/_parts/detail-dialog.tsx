"use client";

import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import type { CommandeListRow, PostalOrderStatus } from "../schemas";
import { TemplatePreview } from "./template-preview";

const STATUT_LABEL: Record<PostalOrderStatus, string> = {
  pending_payment: "En attente de paiement",
  paid: "Payée",
  submitted: "Validée",
  imported: "Prête à expédier",
  expedited: "Expédiée",
  returned: "Retournée",
  archived: "Archivée",
  refunded: "Remboursée",
};

function initials(name: string): string {
  const parts = name.split(/\s+/).filter((word) => /^[a-zà-ÿ]/i.test(word));
  return (
    parts
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function Col({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  return (
    <div className={cn("flex grow flex-col gap-2 font-medium", divider && "md:border-r md:pr-4")}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base text-card-foreground">{value}</p>
    </div>
  );
}

function Recap({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-right text-sm font-medium text-card-foreground">{value}</p>
    </div>
  );
}

export function DetailDialog({ row, children }: { row: CommandeListRow; children: ReactNode }) {
  const address = row.shippingAddress;
  const ligneAdresse = address
    ? [address.street, [address.zip, address.city].filter(Boolean).join(" "), address.country]
        .filter(Boolean)
        .join(", ")
    : "—";
  const dateCommande = new Date(row.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none"
        >
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] w-[820px] max-w-[94vw] overflow-y-auto rounded-[14px] p-0">
        <div className="flex flex-col gap-5 p-6">
          <DialogTitle className="text-2xl font-semibold text-card-foreground">
            Détail commande
          </DialogTitle>

          <div className="flex gap-4 rounded-[14px] border border-border p-6 max-md:flex-col md:items-center">
            <Col label="N° commande" value={`#${row.shortRef}`} divider />
            <Col label="Date de commande" value={dateCommande} divider />
            <Col label="Date événement" value={row.eventDate ?? "—"} divider />
            <Col label="Statut" value={STATUT_LABEL[row.status]} />
          </div>

          <div className="grid gap-3.5 rounded-[14px] border border-border px-6 py-4 md:grid-cols-2 md:items-center">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 rounded-md after:rounded-md">
                <AvatarFallback className="rounded-md bg-primary/10 text-base font-medium text-primary">
                  {initials(row.clientName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-1">
                <h4 className="truncate text-base font-medium text-card-foreground">
                  {row.clientName}
                </h4>
                <span className="truncate text-sm text-muted-foreground">{row.clientEmail}</span>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end md:gap-8">
              <span className="text-sm text-muted-foreground">Événement</span>
              <span className="text-base font-medium text-card-foreground">{row.eventType}</span>
            </div>
          </div>

          <TemplatePreview template={row.template} />

          <div className="space-y-3 rounded-[14px] border border-border p-6">
            <Recap label="Borne assignée" value={row.kapsuleLabel ?? "Non assignée"} />
            <Recap label="Adresse de livraison" value={ligneAdresse} />
            <Separator />
            <DialogClose asChild>
              <Button size="lg" className="mt-2 w-full">
                Fermer
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
