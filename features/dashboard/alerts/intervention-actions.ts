"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { can } from "@/features/auth/permissions";
import { getSessionUser } from "@/features/auth/session";
import { addEvent } from "@/features/google-calendar/events";
import { getTokens } from "@/features/google-calendar/tokens";
import { createAdminClient } from "@/lib/supabase/admin";

const itemSchema = z.object({
  borne_id: z.string().uuid(),
  type: z.string().min(1),
  alerte_id: z.string().uuid().nullable(),
});

const inputSchema = z.object({
  items: z.array(itemSchema).min(1),
  intervenant_id: z.string().uuid(),
  date: z.string().min(1),
  description: z.string().optional(),
});

export type CreateInterventionsInput = z.infer<typeof inputSchema>;

export async function createInterventionsBulk(input: CreateInterventionsInput) {
  const session = await getSessionUser();
  if (!session) throw new Error("Non authentifié");
  if (!can(session.permissions, "interventions.create"))
    throw new Error("Permission refusée");

  const parsed = inputSchema.parse(input);
  const supabase = createAdminClient();

  const rows = parsed.items.map((i) => ({
    borne_id: i.borne_id,
    alerte_id: i.alerte_id,
    type: i.type,
    intervenant_id: parsed.intervenant_id,
    date: parsed.date,
    description: parsed.description ?? null,
  }));

  const { error } = await supabase.from("interventions").insert(rows);
  if (error) throw new Error(error.message);

  // Push vers Google Calendar de l'assignee (non-bloquant, best-effort)
  try {
    const hasTokens = await getTokens(parsed.intervenant_id);
    if (hasTokens) {
      const { data: bornes } = await supabase
        .from("bornes")
        .select("id, nom_lieu")
        .in(
          "id",
          parsed.items.map((i) => i.borne_id),
        );
      const names = (bornes ?? []).map((b) => b.nom_lieu).join(", ");
      await addEvent(parsed.intervenant_id, {
        summary: `Intervention · ${names || "Bornes"}`,
        description: parsed.description ?? undefined,
        start: { date: parsed.date },
        end: { date: parsed.date },
      });
    }
  } catch (err) {
    console.warn("[google-calendar] push failed:", err);
  }

  revalidatePath("/");
  revalidatePath("/parc/interventions");
}
