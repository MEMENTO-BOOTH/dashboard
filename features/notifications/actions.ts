"use server";

import { getSessionUser } from "@/features/auth/session";
import { createPostalClient } from "@/lib/supabase/postal";
import { type Notification, orderEventRowSchema } from "./schemas";

export async function getRecentNotifications(): Promise<Notification[]> {
  const session = await getSessionUser();
  if (!session) throw new Error("Non authentifié");

  const supabase = createPostalClient();
  const { data, error } = await supabase
    .from("order_events")
    .select("id, order_id, event_type, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;

  return (data ?? []).map((row) => {
    const parsed = orderEventRowSchema.parse(row);
    return {
      id: parsed.id,
      orderId: parsed.order_id,
      type: parsed.event_type,
      createdAt: parsed.created_at,
    };
  });
}
