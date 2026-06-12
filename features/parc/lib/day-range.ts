const PARIS_TZ = "Europe/Paris";

function parisOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  return asUtc - date.getTime();
}

export function parisDayRangeIso(ymd: string): { startIso: string; endIso: string } {
  const parts = ymd.split("-").map(Number);
  const y = parts[0] ?? 1970;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const offset = parisOffsetMs(new Date(Date.UTC(y, m - 1, d, 12)));
  const startMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0) - offset;
  const endMs = Date.UTC(y, m - 1, d, 23, 59, 59, 999) - offset;
  return { startIso: new Date(startMs).toISOString(), endIso: new Date(endMs).toISOString() };
}
