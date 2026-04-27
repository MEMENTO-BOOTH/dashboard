import "server-only";
import { getFreshAccessToken } from "./tokens";

const API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export type CalendarEvent = {
  summary: string;
  description?: string;
  start: { date?: string; dateTime?: string; timeZone?: string };
  end: { date?: string; dateTime?: string; timeZone?: string };
  location?: string;
};

export async function addEvent(userId: string, event: CalendarEvent): Promise<string | null> {
  const accessToken = await getFreshAccessToken(userId);
  if (!accessToken) return null;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Calendar event creation failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { id?: string };
  return data.id ?? null;
}
