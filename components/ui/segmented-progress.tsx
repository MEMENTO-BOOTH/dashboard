// Figma 39616:58795 Advance Progress / vvariant17
// Header: title (flex-1) + value (label) — both 14/20 Medium foreground
// Bars row: flex gap-1 w-full; each bar h-[16px] rounded-full
//   filled: bg-primary; empty: bg-primary/20
// Bars use flex-1 to span container width.

const DEFAULT_SEGMENTS = 8;

export function SegmentedProgress({
  title,
  value,
  label,
  segments = DEFAULT_SEGMENTS,
}: {
  title: string;
  value: number;
  label?: string;
  segments?: number;
}) {
  const filled = Math.max(0, Math.min(segments, Math.round((value / 100) * segments)));
  const bars = Array.from({ length: segments }, (_, i) => i < filled);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <p className="flex-1 truncate text-[14px] font-medium leading-5 text-foreground">
          {title}
        </p>
        <p className="shrink-0 text-[14px] font-medium leading-5 text-foreground">
          {label ?? `${value}%`}
        </p>
      </div>
      <div className="flex w-full items-start gap-1">
        {bars.map((isFilled, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static segmented bar, fixed length
            key={i}
            className={`h-4 flex-1 rounded-full ${isFilled ? "bg-primary" : "bg-primary/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
