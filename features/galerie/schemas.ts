import { z } from "zod";

export const galeriePhotoSchema = z.object({
  fileName: z.string(),
  downloadUrl: z.string().url(),
  sizeBytes: z.number(),
});
export type GaleriePhoto = z.infer<typeof galeriePhotoSchema>;

export const galerieSchema = z.object({
  orderId: z.string(),
  eventType: z.string(),
  eventDate: z.string(),
  photos: z.array(galeriePhotoSchema),
});
export type Galerie = z.infer<typeof galerieSchema>;
