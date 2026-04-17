const timeFr = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dateFr = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" });

export function formatBugTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const min = Math.round(diffMs / 60000);

  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) return `Aujourd'hui ${timeFr.format(date)}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isYesterday) return `Hier ${timeFr.format(date)}`;

  return `${dateFr.format(date)} ${timeFr.format(date)}`;
}
