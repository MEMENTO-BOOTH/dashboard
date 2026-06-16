import { z } from "zod";

export const templateElementSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().optional(),
  zIndex: z.number().optional(),
  visible: z.boolean().optional(),
  color: z.string().optional(),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  fillType: z.string().optional(),
  imageUrl: z.string().optional(),
  content: z.string().optional(),
  fontSize: z.number().optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.string().optional(),
  fontStyle: z.string().optional(),
  textAlign: z.string().optional(),
  shape: z.string().optional(),
  cornerRadius: z.number().optional(),
  slotIndex: z.number().optional(),
});
export type TemplateElement = z.infer<typeof templateElementSchema>;

export const templateFullSchema = z.object({
  name: z.string().optional(),
  width: z.number().positive(),
  height: z.number().positive(),
  supportsCutOption: z.boolean().optional(),
  elements: z.array(templateElementSchema).default([]),
});
export type TemplateFull = z.infer<typeof templateFullSchema>;
