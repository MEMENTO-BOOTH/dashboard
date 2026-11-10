import { DAY_MS } from "./types";

export const daysBetween = (from: Date, to: Date): number =>
  (to.getTime() - from.getTime()) / DAY_MS;

/** « 40 min », « 5 h », « 3 j » : texte des cartes. */
export function formatDurationFr(ms: number): string {
  const safe = Math.max(0, ms);
  if (safe < 3_600_000) return `${Math.max(1, Math.round(safe / 60_000))} min`;
  if (safe < DAY_MS) return `${Math.floor(safe / 3_600_000)} h`;
  return `${Math.floor(safe / DAY_MS)} j`;
}

/** « il y a 40 min », « il y a 5 h », puis « 9 nov. · 11:28 » au-delà d'un jour. */
export function formatWhen(date: Date, now: Date): string {
  const diff = now.getTime() - date.getTime();
  if (diff >= 0 && diff < DAY_MS) return `il y a ${formatDurationFr(diff)}`;
  const day = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Paris",
  });
  const time = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
  return `${day} · ${time}`;
}

/** Date au format AAAA-MM-JJ -> « lundi 10 novembre ». */
export function formatPlannedDate(value: string): string {
  const [y = 1970, m = 1, d = 1] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  });
}
