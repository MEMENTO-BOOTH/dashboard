import "server-only";
import { env } from "@/lib/env";
import type { CreatedLicence, CreateLicenceInput } from "./schemas";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "client";
}

async function adminPost(path: string, body: unknown): Promise<Record<string, unknown>> {
  const token = env.KAPSULE_LICENCES_ADMIN_TOKEN;
  if (!token) throw new Error("KAPSULE_LICENCES_ADMIN_TOKEN manquant côté serveur");
  const res = await fetch(`${env.KAPSULE_LICENCES_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend licences (${res.status}) : ${text.slice(0, 200)}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

export async function createClientLicence(input: CreateLicenceInput): Promise<CreatedLicence> {
  const suffix = Math.random().toString(36).slice(2, 7);
  const tenantRes = await adminPost("/api/v1/tenants", {
    slug: `${slugify(input.clientName)}-${suffix}`,
    name: input.clientName,
    kind: "client",
  });
  const tenant = tenantRes.tenant as { id: string };

  const borneRes = await adminPost(`/api/v1/tenants/${tenant.id}/bornes`, {
    code: input.borneCode,
  });
  const borne = borneRes.borne as { id: string };

  const codeRes = await adminPost(
    `/api/v1/tenants/${tenant.id}/bornes/${borne.id}/activation-codes`,
    { plan: "perpetual-5y", expiresInDays: 30 },
  );

  return {
    code: codeRes.code as string,
    tenantId: tenant.id,
    borneId: borne.id,
    clientName: input.clientName,
    borneCode: input.borneCode,
  };
}
