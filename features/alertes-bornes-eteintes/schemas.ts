import { z } from "zod";

export const cronQuerySchema = z.object({
  dry: z
    .union([z.literal("1"), z.literal("true")])
    .optional()
    .transform((v) => v !== undefined),
});

export type CronQuery = z.infer<typeof cronQuerySchema>;
