// Formatteurs unifiés pour toute l'app — montants EUR, pourcentages, dates de période.
// Convention :
//  - formatEUR  → "1 234 €"   (entier, espace insécable, € après)
//  - formatEURCompact → "21k €" pour ≥ 1000, sinon "234 €"
//  - formatPct  → "+12,3 %"   (signé, virgule, espace, %)
//  - formatTrend → null → "—"
//  - formatPeriodRange → "20 avr. → 26 avr."

const NBSP = " ";

export function formatEUR(n: number): string {
  const v = Math.round(n);
  return `${v.toLocaleString("fr-FR")}${NBSP}€`;
}

export function formatEURCompact(n: number): string {
  if (Math.abs(n) >= 1000) {
    const k = n / 1000;
    const display = Math.abs(k) >= 10 ? Math.round(k) : Number(k.toFixed(1));
    return `${display.toString().replace(".", ",")}k${NBSP}€`;
  }
  return `${Math.round(n)}${NBSP}€`;
}

export function formatPct(n: number): string {
  const sign = n >= 0 ? "+" : "";
  const abs = n.toFixed(1).replace(".", ",").replace("-", "−");
  return `${sign}${abs}${NBSP}%`;
}

export function formatTrend(n: number | null): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return formatPct(n);
}

export function formatPeriodRange(start: Date, endExclusive: Date): string {
  const endInclusive = addDays(endExclusive, -1);
  const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  return `${fmt(start)} → ${fmt(endInclusive)}`;
}

export function formatTrendValue(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? null : null;
  return ((current - previous) / previous) * 100;
}

export function startOfMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function startOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Utilise setDate() (jours civils) plutôt que getTime() + ms — sinon le passage
// à l'heure d'été (~29 mars en Europe) décale d'1h et fait basculer d'un jour.
export function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}
