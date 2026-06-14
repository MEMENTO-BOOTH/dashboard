"use server";

import { revalidatePath } from "next/cache";
import { can, type Permission } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { createPostalClient } from "@/lib/supabase/postal";

async function requirePermission(perm: Permission) {
  const session = await getSessionUser();
  if (!session) throw new Error("Non authentifié");
  if (!can(session.permissions, perm)) throw new Error("Permission refusée");
  return session;
}

export async function assignerBorne(orderId: string, kapsuleId: string): Promise<void> {
  const session = await requirePermission("commandes.assign");
  const supabase = createPostalClient();

  const updated = await supabase
    .from("postal_orders")
    .update({ kapsule_id: kapsuleId, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (updated.error) throw updated.error;

  const event = await supabase.from("order_events").insert({
    order_id: orderId,
    event_type: "order_assigned",
    actor: { kind: "admin", id: session.id, name: session.nom },
    payload: { kapsuleId },
  });
  if (event.error) throw event.error;

  revalidatePath("/postal-apercu");
}

export async function marquerExpediee(
  orderId: string,
  trackingNumber: string,
  carrier: string,
): Promise<void> {
  const session = await requirePermission("commandes.expedite");
  const supabase = createPostalClient();
  const now = new Date().toISOString();

  const updated = await supabase
    .from("postal_orders")
    .update({
      status: "expedited",
      expedited_at: now,
      tracking_number: trackingNumber,
      carrier,
      updated_at: now,
    })
    .eq("id", orderId);
  if (updated.error) throw updated.error;

  const event = await supabase.from("order_events").insert({
    order_id: orderId,
    event_type: "order_expedited",
    actor: { kind: "admin", id: session.id, name: session.nom },
    payload: { trackingNumber, carrier },
  });
  if (event.error) throw event.error;

  revalidatePath("/postal");
}
