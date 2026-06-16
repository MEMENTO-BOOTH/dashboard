import { z } from "zod";

export const activiteKindSchema = z.enum([
  "enroll",
  "create",
  "pay",
  "submit",
  "edit",
  "assign",
  "import",
  "expedite",
  "return",
  "refund",
  "archive",
]);
export type ActiviteKind = z.infer<typeof activiteKindSchema>;

export const activiteEventSchema = z.object({
  id: z.string(),
  kind: activiteKindSchema,
  label: z.string(),
  detail: z.string(),
  since: z.string(),
});
export type ActiviteEvent = z.infer<typeof activiteEventSchema>;
