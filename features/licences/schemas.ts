import { z } from "zod";

export const createLicenceSchema = z.object({
  clientName: z.string().min(1, "Nom du client requis").max(100),
  borneCode: z.string().min(1, "Code de la borne requis").max(50),
});
export type CreateLicenceInput = z.infer<typeof createLicenceSchema>;

export interface CreatedLicence {
  code: string;
  tenantId: string;
  borneId: string;
  clientName: string;
  borneCode: string;
}

export const licenceRowSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  tenantName: z.string().nullable(),
  borneId: z.string(),
  borneCode: z.string().nullable(),
  status: z.string(),
  plan: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
  revokedAt: z.string().nullable(),
  lastSeenAt: z.string().nullable(),
});
export type LicenceRow = z.infer<typeof licenceRowSchema>;

export const borneRowSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  tenantName: z.string().nullable(),
  code: z.string(),
  createdAt: z.string(),
  lastSeenAt: z.string().nullable(),
});
export type BorneRow = z.infer<typeof borneRowSchema>;

export type LicenceStatus = "pending" | "active" | "revoked";

export interface LicenceOverview {
  borneId: string;
  tenantId: string;
  tenantName: string;
  borneCode: string;
  status: LicenceStatus;
  licenseId: string | null;
  createdAt: string;
  lastSeenAt: string | null;
}
