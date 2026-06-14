import "server-only";

import { createPostalClient } from "@/lib/supabase/postal";
import { type KapsuleRow, kapsuleRowSchema } from "./schemas";

const ONLINE_WINDOW_MS = 3 * 60 * 1000;
const OCCUPYING_STATUTS = ["paid", "submitted", "imported", "expedited"];

function bornesLabel(seq: number): string {
  return `BE-${String(seq).padStart(2, "0")}`;
}

export async function getKapsules(): Promise<KapsuleRow[]> {
  const supabase = createPostalClient();
  const [kapsulesRes, ordersRes] = await Promise.all([
    supabase.from("kapsules").select("id, seq, app_version, last_seen_at, revoked_at").order("seq"),
    supabase.from("postal_orders").select("id, kapsule_id, status").in("status", OCCUPYING_STATUTS),
  ]);
  if (kapsulesRes.error) throw kapsulesRes.error;
  if (ordersRes.error) throw ordersRes.error;

  const orderByKapsule = new Map<string, string>();
  for (const order of ordersRes.data) {
    if (order.kapsule_id && !orderByKapsule.has(order.kapsule_id)) {
      orderByKapsule.set(order.kapsule_id, order.id);
    }
  }

  const now = Date.now();
  return kapsulesRes.data.map((kapsule) => {
    const seen = kapsule.last_seen_at ? new Date(kapsule.last_seen_at).getTime() : 0;
    const online = kapsule.revoked_at === null && now - seen < ONLINE_WINDOW_MS;
    return kapsuleRowSchema.parse({
      id: kapsule.id,
      label: bornesLabel(kapsule.seq),
      appVersion: kapsule.app_version,
      online,
      revoked: kapsule.revoked_at !== null,
      lastSeenAt: kapsule.last_seen_at,
      assignedOrderId: orderByKapsule.get(kapsule.id) ?? null,
    });
  });
}
