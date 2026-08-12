"use server";

import { getSessionUser } from "@/features/auth/session";
import { createClientLicence } from "./api";
import { type CreatedLicence, createLicenceSchema } from "./schemas";

export type CreateLicenceState = {
  error: string | null;
  licence: CreatedLicence | null;
};

export async function createLicenceAction(
  _prev: CreateLicenceState,
  formData: FormData,
): Promise<CreateLicenceState> {
  const session = await getSessionUser();
  if (!session) return { error: "Non authentifié", licence: null };

  const parsed = createLicenceSchema.safeParse({
    clientName: formData.get("clientName"),
    borneCode: formData.get("borneCode"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Entrée invalide", licence: null };
  }

  try {
    const licence = await createClientLicence(parsed.data);
    return { error: null, licence };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue", licence: null };
  }
}
