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
