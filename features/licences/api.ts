import "server-only";
import { env } from "@/lib/env";
import {
  type BorneRow,
  borneRowSchema,
  type CreatedLicence,
  type CreateLicenceInput,
  type LicenceOverview,
  type LicenceRow,
  licenceRowSchema,
} from "./schemas";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "client";
}

function adminHeaders(token: string): Record<string, string> {
  return { "content-type": "application/json", authorization: `Bearer ${token}` };
}

async function adminPost(path: string, body: unknown): Promise<Record<string, unknown>> {
  const token = env.KAPSULE_LICENCES_ADMIN_TOKEN;
  if (!token) throw new Error("KAPSULE_LICENCES_ADMIN_TOKEN manquant côté serveur");
  const res = await fetch(`${env.KAPSULE_LICENCES_URL}${path}`, {
    method: "POST",
    headers: adminHeaders(token),
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

export async function listLicences(): Promise<LicenceRow[]> {
  const token = env.KAPSULE_LICENCES_ADMIN_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(`${env.KAPSULE_LICENCES_URL}/api/v1/licenses`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { licenses?: unknown };
    const list = Array.isArray(body.licenses) ? body.licenses : [];
    const rows: LicenceRow[] = [];
    for (const row of list) {
      const parsed = licenceRowSchema.safeParse(row);
      if (parsed.success) rows.push(parsed.data);
    }
    return rows;
  } catch {
    return [];
  }
}

async function listBornes(): Promise<BorneRow[]> {
  const token = env.KAPSULE_LICENCES_ADMIN_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(`${env.KAPSULE_LICENCES_URL}/api/v1/bornes`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { bornes?: unknown };
    const list = Array.isArray(body.bornes) ? body.bornes : [];
    const rows: BorneRow[] = [];
    for (const row of list) {
      const parsed = borneRowSchema.safeParse(row);
      if (parsed.success) rows.push(parsed.data);
    }
    return rows;
  } catch {
    return [];
  }
}

export async function listOverview(): Promise<LicenceOverview[]> {
  const [bornes, licences] = await Promise.all([listBornes(), listLicences()]);
  const byBorne = new Map<string, LicenceRow[]>();
  for (const l of licences) {
    const arr = byBorne.get(l.borneId) ?? [];
    arr.push(l);
    byBorne.set(l.borneId, arr);
  }
  return bornes.map((b) => {
    const lics = byBorne.get(b.id) ?? [];
    const active = lics.find((l) => l.status === "active");
    const revoked = lics.find((l) => l.status === "revoked");
    const status = active ? "active" : revoked ? "revoked" : "pending";
    return {
      borneId: b.id,
      tenantId: b.tenantId,
      tenantName: b.tenantName ?? "—",
      borneCode: b.code,
      status,
      licenseId: active?.id ?? null,
      createdAt: b.createdAt,
      lastSeenAt: active?.lastSeenAt ?? b.lastSeenAt,
    };
  });
}

export async function revokeLicence(
  tenantId: string,
  borneId: string,
  licenseId: string,
): Promise<boolean> {
  const token = env.KAPSULE_LICENCES_ADMIN_TOKEN;
  if (!token) return false;
  const res = await fetch(
    `${env.KAPSULE_LICENCES_URL}/api/v1/tenants/${tenantId}/bornes/${borneId}/licenses/${licenseId}/revoke`,
    {
      method: "POST",
      headers: adminHeaders(token),
      body: JSON.stringify({ reason: "Révoqué depuis le dashboard" }),
      cache: "no-store",
    },
  );
  return res.ok;
}
