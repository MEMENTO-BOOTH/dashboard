import {
  Bell,
  CreditCard,
  FilePen,
  type LucideIcon,
  PackageCheck,
  RotateCcw,
  Send,
  ShoppingBag,
  Truck,
  Undo2,
} from "lucide-react";

type EventMeta = { label: string; Icon: LucideIcon };

const EVENT_META: Record<string, EventMeta> = {
  order_created: { label: "Nouvelle commande", Icon: ShoppingBag },
  stripe_session_created: { label: "Paiement initié", Icon: CreditCard },
  order_paid: { label: "Paiement reçu", Icon: CreditCard },
  order_submitted: { label: "Design validé par le client", Icon: Send },
  template_updated: { label: "Template modifié", Icon: FilePen },
  order_assigned: { label: "Commande assignée à une borne", Icon: PackageCheck },
  order_imported: { label: "Borne a installé la commande", Icon: PackageCheck },
  order_expedited: { label: "Borne expédiée", Icon: Truck },
  order_returned: { label: "Photos reçues — borne retournée", Icon: Undo2 },
  order_refunded: { label: "Commande remboursée", Icon: RotateCcw },
  order_archived: { label: "Commande archivée", Icon: PackageCheck },
};

export function metaForEvent(type: string): EventMeta {
  return EVENT_META[type] ?? { label: type, Icon: Bell };
}
