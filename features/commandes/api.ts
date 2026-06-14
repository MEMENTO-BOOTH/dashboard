import "server-only";

import { createPostalClient } from "@/lib/supabase/postal";
import {
  type CommandeAction,
  type CommandeListRow,
  type CommandeRow,
  type CommandesSummary,
  commandeListRowSchema,
  commandeRowSchema,
  commandesSummarySchema,
  shippingAddressSchema,
} from "./schemas";

const ACTIONABLE_STATUTS = ["paid", "submitted", "imported", "returned"];
const SUMMARY_STATUTS = ["paid", "submitted", "imported", "expedited", "returned"];
const LIST_STATUTS = [
  "paid",
  "submitted",
  "imported",
  "expedited",
  "returned",
  "archived",
  "refunded",
];
const SELECT_FIELDS =
  "id, client_email, event_type, event_date, status, kapsule_id, shipping_address, return_share_token, template, created_at";

function bornesLabel(seq: number): string {
  return `BE-${String(seq).padStart(2, "0")}`;
}

function actionFor(status: string, kapsuleId: string | null): CommandeAction | null {
  if (status === "returned") return "envoyer_photos";
  if (status === "imported") return "expedier";
  if ((status === "paid" || status === "submitted") && !kapsuleId) return "assigner";
  return null;
}

export async function getCommandesATraiter(): Promise<CommandeRow[]> {
  const supabase = createPostalClient();
  const [ordersRes, kapsulesRes] = await Promise.all([
    supabase
      .from("postal_orders")
      .select(
        "id, client_email, event_type, event_date, status, kapsule_id, shipping_address, return_share_token, template, created_at",
      )
      .in("status", ACTIONABLE_STATUTS)
      .order("created_at", { ascending: false }),
    supabase.from("kapsules").select("id, seq"),
  ]);
  if (ordersRes.error) throw ordersRes.error;
  if (kapsulesRes.error) throw kapsulesRes.error;

  const labelById = new Map(kapsulesRes.data.map((k) => [k.id, bornesLabel(k.seq)]));

  const rows: CommandeRow[] = [];
  for (const order of ordersRes.data) {
    const action = actionFor(order.status, order.kapsule_id);
    if (!action) continue;
    const parsedAddress = shippingAddressSchema.safeParse(order.shipping_address);
    const address = parsedAddress.success ? parsedAddress.data : null;
    rows.push(
      commandeRowSchema.parse({
        id: order.id,
        shortRef: order.id.slice(0, 8).toUpperCase(),
        clientName: address?.fullName ?? order.client_email,
        clientEmail: order.client_email,
        eventType: order.event_type,
        eventDate: order.event_date,
        status: order.status,
        kapsuleId: order.kapsule_id,
        kapsuleLabel: order.kapsule_id ? (labelById.get(order.kapsule_id) ?? null) : null,
        returnShareToken: order.return_share_token,
        shippingAddress: address,
        template: order.template ?? null,
        action,
        createdAt: order.created_at,
      }),
    );
  }
  return rows;
}

export async function getCommandesSummary(): Promise<CommandesSummary> {
  const supabase = createPostalClient();
  const { data, error } = await supabase
    .from("postal_orders")
    .select("status, kapsule_id")
    .in("status", SUMMARY_STATUTS);
  if (error) throw error;

  let aAssigner = 0;
  let aExpedier = 0;
  let chezClient = 0;
  let photosAEnvoyer = 0;
  for (const order of data) {
    if (order.status === "returned") photosAEnvoyer += 1;
    else if (order.status === "imported") aExpedier += 1;
    else if (order.status === "expedited") chezClient += 1;
    else if ((order.status === "paid" || order.status === "submitted") && !order.kapsule_id)
      aAssigner += 1;
  }
  return commandesSummarySchema.parse({ aAssigner, aExpedier, chezClient, photosAEnvoyer });
}

export async function getAllCommandes(): Promise<CommandeListRow[]> {
  const supabase = createPostalClient();
  const [ordersRes, kapsulesRes] = await Promise.all([
    supabase
      .from("postal_orders")
      .select(SELECT_FIELDS)
      .in("status", LIST_STATUTS)
      .order("created_at", { ascending: false }),
    supabase.from("kapsules").select("id, seq"),
  ]);
  if (ordersRes.error) throw ordersRes.error;
  if (kapsulesRes.error) throw kapsulesRes.error;

  const labelById = new Map(kapsulesRes.data.map((k) => [k.id, bornesLabel(k.seq)]));

  return ordersRes.data.map((order) => {
    const parsedAddress = shippingAddressSchema.safeParse(order.shipping_address);
    const address = parsedAddress.success ? parsedAddress.data : null;
    return commandeListRowSchema.parse({
      id: order.id,
      shortRef: order.id.slice(0, 8).toUpperCase(),
      clientName: address?.fullName ?? order.client_email,
      clientEmail: order.client_email,
      eventType: order.event_type,
      eventDate: order.event_date,
      status: order.status,
      kapsuleId: order.kapsule_id,
      kapsuleLabel: order.kapsule_id ? (labelById.get(order.kapsule_id) ?? null) : null,
      returnShareToken: order.return_share_token,
      shippingAddress: address,
      template: order.template ?? null,
      action: actionFor(order.status, order.kapsule_id),
      createdAt: order.created_at,
    });
  });
}
