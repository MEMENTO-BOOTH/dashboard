import type React from "react";
import { cn } from "@/lib/utils/cn";

/** Un seul "+" registration mark */
function CrossMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("relative size-[10px]", className)} style={style}>
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-[#d9d9d9]" />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d9d9d9]" />
    </div>
  );
}

export interface PhotoStripProps {
  /** 4 URLs de photos (slot vide = blanc) */
  photos?: (string | null)[];
  /** URL du logo Kapsule */
  logoSrc?: string;
  className?: string;
  /** Facteur de mise à l'échelle (défaut: 1) */
  scale?: number;
}

/**
 * Strip de photobooth Kapsule — 4 slots de photos avec logo en bas.
 * Dimensions originales Figma : 184 × 546 px.
 */
export function PhotoStrip({
  photos = [],
  logoSrc = "/kapsule-logo.svg",
  className,
  scale = 1,
}: PhotoStripProps) {
  const w = 184 * scale;
  const h = 546 * scale;
  const photoW = 156 * scale;
  const photoH = 108 * scale;
  const px = 14 * scale; // padding horizontal
  const pt = 13 * scale; // padding top
  const gap = 9 * scale; // gap entre photos
  const logoW = 121 * scale;
  const logoH = 39 * scale;

  return (
    <div
      className={cn("relative flex-shrink-0 overflow-hidden", className)}
      style={{ width: w, height: h, backgroundColor: "#2d3e90", borderRadius: 2 * scale }}
    >
      {/* 4 slots photo */}
      <div
        className="absolute top-0 left-0 flex flex-col"
        style={{ paddingTop: pt, paddingLeft: px, paddingRight: px, gap }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{ width: photoW, height: photoH, backgroundColor: "#fcfcfc" }}
            className="overflow-hidden"
          >
            {photos[i] ? (
              // biome-ignore lint/performance/noImgElement: photo du photobooth
              <img
                src={photos[i] ?? undefined}
                alt={`Tirage ${i + 1}`}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Zone bas : registration marks + logo */}
      {/* Marks haut-gauche */}
      <CrossMark className="absolute" style={{ left: 9 * scale, top: 488 * scale - 5 * scale }} />
      {/* Marks haut-droite */}
      <CrossMark
        className="absolute"
        style={{ right: (184 - 170) * scale, top: 488 * scale - 5 * scale }}
      />

      {/* Logo Kapsule centré */}
      {/* biome-ignore lint/performance/noImgElement: logo statique du strip */}
      <img
        src={logoSrc}
        alt="Kapsule"
        style={{
          position: "absolute",
          left: 184 / 2 - logoW / 2,
          top: 490 * scale,
          width: logoW,
          height: logoH,
        }}
      />

      {/* Marks bas-gauche */}
      <CrossMark className="absolute" style={{ left: 9 * scale, top: 533 * scale - 5 * scale }} />
      {/* Marks bas-droite */}
      <CrossMark
        className="absolute"
        style={{ right: (184 - 170) * scale, top: 533 * scale - 5 * scale }}
      />
    </div>
  );
}
