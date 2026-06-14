import { z } from "zod";

export const kapsuleRowSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  appVersion: z.string().nullable(),
  online: z.boolean(),
  revoked: z.boolean(),
  lastSeenAt: z.string().nullable(),
  assignedOrderId: z.string().uuid().nullable(),
});
export type KapsuleRow = z.infer<typeof kapsuleRowSchema>;
