import { z } from "zod";
import { COLUMN_NAME_MAX, MAX_COLUMNS, MIN_COLUMNS, TITLE_MAX } from "./lib";

export const priorityInputSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const originInputSchema = z.enum(["diag", "logiciel", "materiel", "reseau"]);

export const createIncidentSchema = z.object({
  title: z.string().trim().min(1).max(TITLE_MAX),
  borneId: z.string().uuid(),
  priority: priorityInputSchema.optional(),
  origin: originInputSchema.optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  description: z.string().max(4000).optional(),
  source: z.enum(["manuel", "bar"]).default("manuel"),
});
export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;

export const moveIncidentSchema = z.object({
  incidentId: z.string().uuid(),
  toColumnId: z.string().uuid(),
});
export type MoveIncidentInput = z.infer<typeof moveIncidentSchema>;

export const patchIncidentSchema = z.object({
  incidentId: z.string().uuid(),
  title: z.string().trim().min(1).max(TITLE_MAX).optional(),
  description: z.string().max(4000).optional(),
  priority: priorityInputSchema.optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  origin: originInputSchema.optional(),
  intervention: z.enum(["distance", "surplace"]).nullable().optional(),
  solution: z.enum(["provisoire", "definitive"]).nullable().optional(),
  plannedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});
export type PatchIncidentInput = z.infer<typeof patchIncidentSchema>;

export const addNoteSchema = z.object({
  incidentId: z.string().uuid(),
  body: z.string().trim().min(1).max(4000),
});
export type AddNoteInput = z.infer<typeof addNoteSchema>;

export const falseAlarmSchema = z.object({
  incidentId: z.string().uuid(),
  ignoreSignal: z.boolean(),
  reason: z.string().max(4000).optional(),
});
export type FalseAlarmInput = z.infer<typeof falseAlarmSchema>;

export const reopenIncidentSchema = z.object({ incidentId: z.string().uuid() });
export type ReopenIncidentInput = z.infer<typeof reopenIncidentSchema>;

const columnPlanItemSchema = z.object({
  id: z.string().uuid().optional(), // absent = nouvelle colonne
  name: z.string().trim().min(1).max(COLUMN_NAME_MAX),
  role: z.enum(["entree", "libre", "observation", "cloture", "rejete"]),
  observationDays: z.number().int().min(1).max(60).nullable(),
  position: z.number().int(),
});

export const saveColumnsSchema = z.object({
  columns: z.array(columnPlanItemSchema).min(MIN_COLUMNS).max(MAX_COLUMNS),
  /** id de colonne supprimée -> id de colonne de destination. */
  moves: z.record(z.string().uuid(), z.string().uuid()),
});
export type SaveColumnsInput = z.infer<typeof saveColumnsSchema>;

export const saveSettingsSchema = z.object({
  stagnationDays: z.number().int().min(1).max(60),
  archiveDays: z.number().int().min(1).max(365),
  recurrenceThreshold: z.number().int().min(2).max(20),
  recidiveWindowDays: z.number().int().min(1).max(365),
});
export type SaveSettingsInput = z.infer<typeof saveSettingsSchema>;

export const saveSignalRuleSchema = z.object({
  signalType: z.string().trim().min(1),
  label: z.string().trim().min(1),
  defaultPriority: priorityInputSchema,
  defaultOrigin: originInputSchema,
  takesBorneDown: z.boolean(),
});
export type SaveSignalRuleInput = z.infer<typeof saveSignalRuleSchema>;
