import "server-only";

import { createPostalClient } from "@/lib/supabase/postal";
import { type ActiviteEvent, type ActiviteKind, activiteEventSchema } from "./schemas";

const EVENT_MAP: Record<string, { kind: ActiviteKind; label: string }> = {
  order_assigned: { kind: "assign", label: "Borne assignée" },
  order_imported: { kind: "import", label: "Template installé" },
  order_returned: { kind: "return", label: "Photos reçues" },
};

function bornesLabel(seq: number): string {
  return `BE-${String(seq).padStart(2, "0")}`;
}

function relative(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `il y a ${hours} h`;
  return `il y a ${Math.floor(hours / 24)} j`;
}

export async function getActiviteRecente(limit = 8): Promise<ActiviteEvent[]> {
  const supabase = createPostalClient();
  const [eventsRes, kapsulesRes, ordersRes] = await Promise.all([
    supabase
      .from("order_events")
      .select("id, order_id, event_type, created_at")
      .in("event_type", ["order_assigned", "order_imported", "order_returned"])
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase.from("kapsules").select("id, seq, enrolled_at"),
    supabase.from("postal_orders").select("id, kapsule_id"),
  ]);
  if (eventsRes.error) throw eventsRes.error;
  if (kapsulesRes.error) throw kapsulesRes.error;
  if (ordersRes.error) throw ordersRes.error;

  const labelById = new Map(kapsulesRes.data.map((k) => [k.id, bornesLabel(k.seq)]));
  const kapsuleByOrder = new Map(ordersRes.data.map((o) => [o.id, o.kapsule_id]));

  const items: { event: ActiviteEvent; ts: number }[] = [];

  for (const ev of eventsRes.data) {
    const mapped = EVENT_MAP[ev.event_type];
    if (!mapped) continue;
    const kapsuleId = kapsuleByOrder.get(ev.order_id) ?? null;
    const borne = kapsuleId ? labelById.get(kapsuleId) : null;
    const ref = `#${ev.order_id.slice(0, 8).toUpperCase()}`;
    items.push({
      ts: new Date(ev.created_at).getTime(),
      event: {
        id: ev.id,
        kind: mapped.kind,
        label: mapped.label,
        detail: borne ? `${borne} · ${ref}` : ref,
        since: relative(ev.created_at),
      },
    });
  }

  for (const kapsule of kapsulesRes.data) {
    items.push({
      ts: new Date(kapsule.enrolled_at).getTime(),
      event: {
        id: `enroll-${kapsule.id}`,
        kind: "enroll",
        label: "Nouvelle borne enrôlée",
        detail: bornesLabel(kapsule.seq),
        since: relative(kapsule.enrolled_at),
      },
    });
  }

  items.sort((a, b) => b.ts - a.ts);
  return items.slice(0, limit).map((item) => activiteEventSchema.parse(item.event));
}
