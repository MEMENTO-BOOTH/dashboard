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
