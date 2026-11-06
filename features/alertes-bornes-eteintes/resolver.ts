import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { ALERT_TYPE } from "./api";

// Résolution automatique des alertes borne_eteinte_3_jours quand la borne
// renvoie des heartbeats récents (< 3j). Historique : un trigger Postgres
// était censé le faire sur INSERT heartbeats, mais ne se déclenche pas en
// prod (Les Follies 13/10 et Berliner ont dû être résolues à la main). On
// gère donc la résolution côté cron, explicitement.

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export type ResolveResult = {
  checked: number;
  resolved: number;
};

export async function resolveReconnected(now: Date = new Date()): Promise<ResolveResult> {
  const supabase = createAdminClient();
  const freshCutoff = new Date(now.getTime() - THREE_DAYS_MS).toISOString();

  const { data: openAlerts, error } = await supabase
    .from("alertes")
    .select("id, borne_id")
    .eq("type", ALERT_TYPE)
    .eq("statut", "ouverte");
  if (error) throw new Error(error.message);
  if (!openAlerts || openAlerts.length === 0) {
    return { checked: 0, resolved: 0 };
  }

  const toResolve: string[] = [];
  await Promise.all(
    openAlerts.map(async (a) => {
      const { data: latest } = await supabase
        .from("heartbeats")
        .select("timestamp")
        .eq("borne_id", a.borne_id)
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();
      const last = latest?.timestamp;
      if (last && last >= freshCutoff) {
        toResolve.push(a.id);
      }
    }),
  );

  if (toResolve.length === 0) {
    return { checked: openAlerts.length, resolved: 0 };
  }

  const { error: updateErr } = await supabase
    .from("alertes")
    .update({
      statut: "resolue",
      resolue_par: "cron-auto",
      resolue_at: now.toISOString(),
    })
    .in("id", toResolve);
  if (updateErr) throw new Error(updateErr.message);

  return { checked: openAlerts.length, resolved: toResolve.length };
}
