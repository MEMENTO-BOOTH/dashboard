import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ObjectifData } from "../data";

const OBJECTIF_GOAL = 100;

export async function getObjectifData(goal: number = OBJECTIF_GOAL): Promise<ObjectifData> {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("bornes")
    .select("id", { count: "exact", head: true });

  if (error) throw error;

  const deployed = count ?? 0;
  const percent = Math.min(100, Math.round((deployed / goal) * 100));

  return {
    percent,
    achievedLabel: `${deployed} bornes`,
    goalLabel: `Objectif ${goal} bornes`,
  };
}
