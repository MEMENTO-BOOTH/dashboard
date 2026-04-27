"use server";

import { revalidatePath } from "next/cache";
import { deleteTokens } from "./tokens";

export async function disconnectGoogleCalendar(userId: string) {
  await deleteTokens(userId);
  revalidatePath(`/utilisateurs/${userId}`);
  revalidatePath("/utilisateurs");
}
