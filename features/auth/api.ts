import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getBornesCount(): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase.from("bornes").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getUsersCount(): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase.from("utilisateurs").select("*", { count: "exact", head: true });
  return count ?? 0;
}
