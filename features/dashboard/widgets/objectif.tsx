import { Trophy } from "lucide-react";
import { OBJECTIF_DATA, type ObjectifData } from "../data";

// Figma 39543:87901 — exact metadata positions:
// Card: 355 × 215
// Children (x, y, w, h):
//   Blur (39543:87902):        -3.5,  -19, 122, 142
//   Objectif title flex:        240,    8, 108,  28  (text at 24,0 w=70 h=28)
//   Donut (39543:87937):         13,   52, 150, 150
//   "75% atteint":              204,  131,  93,  28
//   "Objectif 100 bornes":      204,  168, 141,  24
//   Focused icon (Trophy):        8,    8,  32,  32  (inner icon 8,8 w=16 h=16)

function Donut({
  percent = 75,
  size = 150,
  stroke = 16,
}: {
  percent?: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  const gap = c - dash;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-border"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${gap}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="text-primary"
      />
    </svg>
  );
}

export function Objectif({ data = OBJECTIF_DATA }: { data?: ObjectifData }) {
  return (
    <div className="relative h-[215px] w-full overflow-clip rounded-[8px] border border-border bg-card">
      {/* Figma 39543:87902 "Colored and blur" — x=-3.5 y=-19 w=122 h=142 */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-[142px] w-[122px] text-primary"
        style={{ left: "-3.5px", top: "-19px" }}
      >
        <svg
          viewBox="0 0 159 163"
          className="absolute inset-[-28.17%_-32.79%] block size-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5" filter="url(#blur-objectif)">
            <ellipse cx="57.5" cy="52" rx="61" ry="71" fill="currentColor" fillOpacity="0.2" />
          </g>
          <defs>
            <filter
              id="blur-objectif"
              x="-43.5"
              y="-59"
              width="202"
              height="222"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_objectif" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Figma 39543:87946 Focused icon — x=8 y=8 w=32 h=32 (bg-sidebar p-2 rounded-[6px] shadow-md) */}
      <div className="absolute left-[8px] top-[8px] z-20 flex items-center rounded-[6px] bg-sidebar p-2 shadow-md">
        <Trophy className="size-4 text-card-foreground" />
      </div>

      {/* Figma 39543:87929 Objectif title flex — x=240 y=8 w=108 h=28 */}
      <div className="absolute left-[240px] top-[8px] flex h-[28px] w-[108px] items-center gap-2 px-6">
        <p className="whitespace-nowrap text-[18px] font-semibold leading-[28px] text-card-foreground">
          Objectif
        </p>
      </div>

      {/* Figma 39543:87937 Donut — x=13 y=52 w=150 h=150 */}
      <div className="absolute left-[13px] top-[52px] z-10 size-[150px]">
        <Donut percent={data.percent} />
      </div>

      {/* Figma 39543:87876 "75% atteint" — x=204 y=131 w=93 h=28 */}
      <p className="absolute left-[204px] top-[131px] h-[28px] w-[93px] whitespace-nowrap text-[18px] font-normal leading-[28px] text-success">
        {data.achievedLabel}
      </p>

      {/* Figma 39543:87877 "Objectif 100 bornes" — x=204 y=168 w=141 h=24 */}
      <p className="absolute left-[204px] top-[168px] h-[24px] w-[141px] whitespace-nowrap text-[16px] font-light leading-6 text-muted-foreground">
        {data.goalLabel}
      </p>
    </div>
  );
}
