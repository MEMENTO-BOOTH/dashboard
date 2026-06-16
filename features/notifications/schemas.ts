import { z } from "zod";

export const orderEventRowSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  event_type: z.string(),
  created_at: z.string(),
});

export type Notification = {
  id: string;
  orderId: string;
  type: string;
  createdAt: string;
};
