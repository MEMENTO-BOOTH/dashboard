import { Trophy } from "lucide-react";
import { OBJECTIF_DATA, type ObjectifData } from "../data";

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

function BlurSwoosh() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-1 -top-5 h-[142px] w-[122px] text-primary"
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
  );
}

export function Objectif({ data = OBJECTIF_DATA }: { data?: ObjectifData }) {
  return (
    <div className="relative flex h-[215px] w-full flex-col overflow-clip rounded-[14px] border border-border bg-card p-2">
      <BlurSwoosh />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex items-center rounded-[6px] bg-sidebar p-2 shadow-md">
          <Trophy className="size-4 text-card-foreground" />
        </div>
        <p className="pr-4 pt-1 text-[18px] font-semibold leading-7 text-card-foreground">
          Objectif
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-end justify-between gap-4 px-2">
        <div className="shrink-0">
          <Donut percent={data.percent} />
        </div>
        <div className="flex flex-col items-start gap-1 pb-4 pr-4">
          <p className="whitespace-nowrap text-[18px] font-normal leading-7 text-success">
            {data.achievedLabel}
          </p>
          <p className="whitespace-nowrap text-[16px] font-normal leading-6 text-muted-foreground">
            {data.goalLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
