const PARIS = "Europe/Paris";

function parisParts(iso: string) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => Number(parts.find((x) => x.type === t)?.value ?? "0");
  return {
    y: get("year"),
    mo: get("month"),
    d: get("day"),
    h: get("hour") % 24,
    mi: get("minute"),
    s: get("second"),
  };
}

export function parisDate(iso: string): Date {
  const p = parisParts(iso);
  return new Date(Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s));
}

export function longDayLabel(ymd: string): string {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString("fr-FR", {
    timeZone: PARIS,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function fmtEuro(n: number): string {
  return `${n.toFixed(2).replace(".", ",")} €`;
}
