// Figma 39616:58709 — advance ratings/variants9
// Component height 72px:
//   - Title/label row (h-5) at top
//   - Gap (32px) — the emoji tooltip floats into this gap
//   - Bar + handle (h-5) at bottom
// Tooltip arrow tip aligns with bar top.

export function CriticalProgress({
  title,
  value,
  label,
  emoji = "😔",
}: {
  title: string;
  value: number;
  label?: string;
  emoji?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="flex h-[72px] w-full flex-col justify-between">
      <div className="flex h-5 w-full items-center gap-2">
        <p className="flex-1 truncate text-[14px] font-medium leading-5 text-foreground">
          {title}
        </p>
        {label ? (
          <p className="shrink-0 text-[14px] font-medium leading-5 text-foreground">{label}</p>
        ) : null}
      </div>

      <div className="relative flex h-5 items-center">
        {/* Bar track + fill */}
        <div className="h-3 w-full overflow-clip rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${clamped}%` }}
          />
        </div>
        {/* Handle */}
        <div
          aria-hidden
          className="pointer-events-none absolute h-5 w-[6px] -translate-x-1/2 rounded-[6px] border-2 border-primary-foreground bg-primary shadow-sm"
          style={{ left: `${clamped}%` }}
        />
        {/* Tooltip — arrow bottom touches bar top (-top-6 = 24px) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${clamped}%` }}
        >
          <div className="flex items-center rounded-full bg-foreground px-1.5 py-0.5">
            <span className="text-[14px] leading-[20px]">{emoji}</span>
          </div>
          <div className="size-0 border-x-[4px] border-t-[4px] border-x-transparent border-t-foreground" />
        </div>
      </div>
    </div>
  );
}
