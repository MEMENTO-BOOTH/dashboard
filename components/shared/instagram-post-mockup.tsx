import { Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface InstagramPostMockupProps {
  /** Pseudo affiché en haut */
  username?: string;
  /** URL de l'avatar (rond 30×30) */
  avatarSrc?: string;
  /** URL de la photo (zone centrale 432×438) */
  photoSrc?: string;
  /** Cœur déjà liké ? (rouge plein) */
  liked?: boolean;
  className?: string;
  /** Facteur de mise à l'échelle (défaut: 1) */
  scale?: number;
}

/**
 * Post Instagram mockup — cadre noir style polaroid, carte blanche intérieure,
 * photo centrale, header (avatar + nom + more) et footer (heart + comment + send).
 *
 * Dimensions originales Figma (file nw6EEv3uKJy7Byj4JtCqRA, node 468:16715) :
 *   - cadre noir extérieur : 456 × 584 px, rounded-[25px]
 *   - carte blanche intérieure : 432 × 560 px, rounded-[25px], #fffbfb
 *   - photo : 432 × 438 px (alignée à gauche, sous le header)
 *   - header : ~50 px, footer : ~72 px
 *   - icônes : 24 × 24, avatar : 30 × 30
 *   - police : Inter 12px
 */
export function InstagramPostMockup({
  username = "stéphanie",
  avatarSrc = "/instagram-mockup/avatar-stephanie.jpg",
  photoSrc = "/instagram-mockup/photo-default.jpg",
  liked = true,
  className,
  scale = 1,
}: InstagramPostMockupProps) {
  // Dimensions exactes Figma
  const w = 456 * scale;
  const h = 584 * scale;
  const innerW = 432 * scale;
  const innerH = 560 * scale;
  const innerOffsetX = 12 * scale; // (456 - 432) / 2
  const innerOffsetY = 12 * scale; // (584 - 560) / 2
  const photoH = 438 * scale;
  const headerH = 50 * scale;
  const footerH = innerH - photoH - headerH;
  const radius = 25 * scale;
  const avatarSize = 30 * scale;
  const iconSize = 24 * scale;
  const headerPx = 12 * scale;
  const headerGap = 13 * scale;
  const fontSize = 12 * scale;
  const footerGap = 12 * scale;
  const footerPx = 12 * scale;

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: w, height: h }}>
      {/* Cadre noir extérieur */}
      <div className="absolute inset-0 bg-black" style={{ borderRadius: radius }} />

      {/* Carte blanche intérieure */}
      <div
        className="absolute overflow-hidden flex flex-col"
        style={{
          left: innerOffsetX,
          top: innerOffsetY,
          width: innerW,
          height: innerH,
          backgroundColor: "#fffbfb",
          borderRadius: radius,
        }}
      >
        {/* Header : avatar + username + more */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            height: headerH,
            paddingLeft: headerPx,
            paddingRight: headerPx,
          }}
        >
          <div className="flex items-center" style={{ gap: headerGap }}>
            {/* biome-ignore lint/performance/noImgElement: avatar local */}
            <img
              src={avatarSrc}
              alt={username}
              width={avatarSize}
              height={avatarSize}
              className="rounded-full object-cover shrink-0"
              style={{ width: avatarSize, height: avatarSize }}
            />
            <span
              className="text-black"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize,
                fontWeight: 400,
                lineHeight: "normal",
              }}
            >
              {username}
            </span>
          </div>
          <MoreHorizontal
            className="text-black shrink-0"
            style={{ width: iconSize, height: iconSize }}
          />
        </div>

        {/* Photo zone */}
        <div className="relative shrink-0" style={{ height: photoH }}>
          {photoSrc ? (
            // biome-ignore lint/performance/noImgElement: photo client Memento
            <img
              src={photoSrc}
              alt={`Souvenir Memento Booth de ${username}`}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 size-full" style={{ backgroundColor: "#cd3cc1" }} />
          )}
        </div>

        {/* Footer : heart + comment + send */}
        <div
          className="flex items-center shrink-0"
          style={{
            height: footerH,
            paddingLeft: footerPx,
            paddingRight: footerPx,
            gap: footerGap,
          }}
        >
          <Heart
            className={liked ? "text-red-500" : "text-black"}
            fill={liked ? "currentColor" : "none"}
            style={{ width: iconSize, height: iconSize }}
          />
          <MessageCircle className="text-black" style={{ width: iconSize, height: iconSize }} />
          <Send className="text-black" style={{ width: iconSize, height: iconSize }} />
        </div>
      </div>
    </div>
  );
}
