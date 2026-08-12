"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/features/auth/session";
import { createClientLicence, revokeLicence } from "./api";
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
    revalidatePath("/licences");
    return { error: null, licence };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue", licence: null };
  }
}

export async function revokeLicenceAction(
  tenantId: string,
  borneId: string,
  licenseId: string,
): Promise<{ ok: boolean }> {
  const session = await getSessionUser();
  if (!session) return { ok: false };
  const ok = await revokeLicence(tenantId, borneId, licenseId);
  if (ok) revalidatePath("/licences");
  return { ok };
}
