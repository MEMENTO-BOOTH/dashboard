import { z } from "zod";

export const barEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  kind: z.string().nullable(),
  deleted: z.boolean().nullable(),
  created_at: z.string(),
});
export type BarEvent = z.infer<typeof barEventSchema>;

export const licencesEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  kind: z.string().nullable(),
  tenantName: z.string().nullable(),
  createdAt: z.string(),
});
export type LicencesEvent = z.infer<typeof licencesEventSchema>;

export type EvenementSource = "bar" | "client";

export interface EvenementView {
  id: string;
  name: string;
  type: "bar" | "event";
  source: EvenementSource;
  client: string | null;
  createdAt: string;
}
