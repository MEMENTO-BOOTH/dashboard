import { z } from "zod";

const elementBaseSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().optional(),
  zIndex: z.number(),
  locked: z.boolean().optional(),
  visible: z.boolean(),
  opacity: z.number().min(0).max(1).optional(),
});

const imageElementSchema = elementBaseSchema.extend({
  type: z.literal("image"),
  imagePath: z.string(),
  fit: z.enum(["cover", "contain", "fill"]),
});

const textElementSchema = elementBaseSchema.extend({
  type: z.literal("text"),
  content: z.string(),
  fontSize: z.number(),
  fontFamily: z.string(),
  fontWeight: z.enum(["normal", "bold"]),
  fontStyle: z.enum(["normal", "italic"]),
  color: z.string(),
  textAlign: z.enum(["left", "center", "right"]),
});

const shapeElementSchema = elementBaseSchema.extend({
  type: z.literal("shape"),
  shape: z.enum(["rectangle", "circle", "line"]),
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  cornerRadius: z.number().optional(),
});

export const watermarkElementSchema = z.discriminatedUnion("type", [
  imageElementSchema,
  textElementSchema,
  shapeElementSchema,
]);

export const watermarkSchema = z.object({
  elements: z.array(watermarkElementSchema),
});

export type WatermarkElement = z.infer<typeof watermarkElementSchema>;
export type Watermark = z.infer<typeof watermarkSchema>;
