"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CreditCardIcon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { OrderCard } from "@/lib/stripe";
import { avatarUrl } from "@/lib/utils/avatar";
import { type CommandeListRow, STATUT_LABEL } from "../schemas";
import { DetailDialog } from "./detail-dialog";

const CARD_LOGOS: Record<string, string> = {
  visa: "/cards/visa.svg",
  mastercard: "/cards/mastercard.svg",
  amex: "/cards/amex.svg",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "—";
}

function prochaineEtape(row: CommandeListRow): string {
  if (row.action === "assigner") return "Assigner une borne";
  if (row.action === "expedier") return "Marquer expédiée";
  if (row.action === "envoyer_photos") return "Envoyer les photos";
  if (row.status === "expedited") return "Chez le client";
  if (row.status === "archived") return "Terminée";
  if (row.status === "refunded") return "Remboursée";
  if (row.kapsuleLabel) return "Borne en préparation";
  return "—";
}

function PaymentCell({ card }: { card?: OrderCard }) {
  if (!card) return <span className="text-muted-foreground">—</span>;
  const logo = CARD_LOGOS[card.brand];
  return (
    <div className="flex items-center gap-2">
      {logo ? (
        <Image
          src={logo}
          alt={card.brand}
          width={34}
          height={22}
          unoptimized
          className="h-5 w-auto"
        />
      ) : (
        <CreditCardIcon className="text-muted-foreground size-5" aria-hidden="true" />
      )}
      <span className="text-muted-foreground text-sm">•••• {card.last4}</span>
    </div>
  );
}

export function buildCommandeColumns(
  cards: Record<string, OrderCard>,
): ColumnDef<CommandeListRow>[] {
  return [
    {
      accessorKey: "shortRef",
      header: "N° commande",
      cell: ({ row }) => (
        <DetailDialog row={row.original}>
          <span className="text-card-foreground font-mono text-sm font-medium underline-offset-2 hover:underline">
            #{row.original.shortRef}
          </span>
        </DetailDialog>
      ),
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-9">
            <AvatarImage src={avatarUrl(row.original.clientName)} alt={row.original.clientName} />
            <AvatarFallback className="text-xs">{initials(row.original.clientName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="text-card-foreground font-medium">{row.original.clientName}</span>
            <span className="text-muted-foreground">{row.original.clientEmail}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge className="bg-primary/10 text-primary h-auto rounded-sm px-1.5">
          {STATUT_LABEL[row.original.status]}
        </Badge>
      ),
    },
    {
      id: "prochaine",
      header: "Prochaine étape",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{prochaineEtape(row.original)}</span>
      ),
    },
    {
      id: "paiement",
      header: "Paiement",
      cell: ({ row }) => <PaymentCell card={cards[row.original.id]} />,
    },
  ];
}
