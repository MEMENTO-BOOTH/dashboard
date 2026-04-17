// Figma 39616:58799 — Segmented progress bar (equalizer)
// 25 vertical bars, w-[4px] h-[16px] rounded-full, gap-1
// Filled: bg-primary, Empty: bg-primary/20

const TOTAL_BARS = 25;

export function SegmentedBar({ value, max }: { value: number; max: number }) {
  const filled = Math.round((value / max) * TOTAL_BARS);

  return (
    <div className="flex items-start gap-1">
      {Array.from({ length: TOTAL_BARS }, (_, i) => (
        <div
          key={i}
          className={`h-4 w-1 shrink-0 rounded-full ${i < filled ? "bg-primary" : "bg-primary/20"}`}
        />
      ))}
    </div>
  );
}
