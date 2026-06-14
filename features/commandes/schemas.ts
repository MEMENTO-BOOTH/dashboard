import { z } from "zod";

export const postalOrderStatuses = [
  "pending_payment",
  "paid",
  "submitted",
  "imported",
  "expedited",
  "returned",
  "archived",
  "refunded",
] as const;

export const postalOrderStatusSchema = z.enum(postalOrderStatuses);
export type PostalOrderStatus = z.infer<typeof postalOrderStatusSchema>;

export const commandeActionSchema = z.enum(["assigner", "expedier", "envoyer_photos"]);
export type CommandeAction = z.infer<typeof commandeActionSchema>;

export const shippingAddressSchema = z.object({
  fullName: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
});
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export const commandeRowSchema = z.object({
  id: z.string().uuid(),
  shortRef: z.string(),
  clientName: z.string(),
  clientEmail: z.string(),
  eventType: z.string(),
  eventDate: z.string().nullable(),
  status: postalOrderStatusSchema,
  kapsuleId: z.string().uuid().nullable(),
  kapsuleLabel: z.string().nullable(),
  returnShareToken: z.string().nullable(),
  shippingAddress: shippingAddressSchema.nullable(),
  template: z.unknown().nullable(),
  action: commandeActionSchema,
  createdAt: z.string(),
});
export type CommandeRow = z.infer<typeof commandeRowSchema>;

export const commandeListRowSchema = commandeRowSchema.extend({
  action: commandeActionSchema.nullable(),
});
export type CommandeListRow = z.infer<typeof commandeListRowSchema>;

export const STATUT_LABEL: Record<PostalOrderStatus, string> = {
  pending_payment: "En attente de paiement",
  paid: "Payée",
  submitted: "Validée",
  imported: "Prête à expédier",
  expedited: "Expédiée",
  returned: "Retournée",
  archived: "Archivée",
  refunded: "Remboursée",
};

export const commandesSummarySchema = z.object({
  aAssigner: z.number(),
  aExpedier: z.number(),
  chezClient: z.number(),
  photosAEnvoyer: z.number(),
});
export type CommandesSummary = z.infer<typeof commandesSummarySchema>;
