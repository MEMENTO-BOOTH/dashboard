// Bornes prod en France → on calcule lundi/jour en heure Paris, peu importe la TZ runtime (Vercel = UTC).

const TZ = "Europe/Paris";
const ymd = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const offsetFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" });

function offsetMs(d: Date): number {
  const m = offsetFmt.format(d).match(/GMT([+-]\d+)/);
  return m ? parseInt(m[1], 10) * 3_600_000 : 0;
}

export function dayDiff(a: Date, b: Date): number {
  return Math.round((Date.parse(ymd.format(a)) - Date.parse(ymd.format(b))) / 86_400_000);
}

export function startOfMonday(now: Date): Date {
  const [y, m, d] = ymd.format(now).split("-").map(Number);
  const wall = new Date(Date.UTC(y, m - 1, d));
  const dow = wall.getUTCDay();
  wall.setUTCDate(wall.getUTCDate() + (dow === 0 ? -6 : 1 - dow));
  return new Date(wall.getTime() - offsetMs(wall));
}
