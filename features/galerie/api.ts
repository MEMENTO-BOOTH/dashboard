import "server-only";

import { env } from "@/lib/env";
import { type Galerie, galerieSchema } from "./schemas";

export async function getGalerieByToken(token: string): Promise<Galerie | null> {
  const res = await fetch(`${env.KAPSULE_API_URL}/api/v1/orders/returns/${token}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;

  const parsed = galerieSchema.safeParse(await res.json());
  if (!parsed.success) return null;
  return parsed.data;
}
