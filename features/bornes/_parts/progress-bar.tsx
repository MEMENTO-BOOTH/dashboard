// Figma 39543:93327 Progress — w=134 h=8 (varies slightly per row)
// Track: bg-muted, fill: chart color per Figma palette

const COLORS = {
  orange: "bg-chart-1", // #EA580C
  teal: "bg-chart-2", // #0D9488
  amber: "bg-chart-5", // #FCAA1D
  darkTeal: "bg-chart-3", // #164E63
} as const;

export function ProgressBar({ value, color }: { value: number; color: keyof typeof COLORS }) {
  return (
    <div className="h-2 w-full overflow-clip rounded-full bg-muted">
      <div className={`h-full rounded-full ${COLORS[color]}`} style={{ width: `${value}%` }} />
    </div>
  );
}
