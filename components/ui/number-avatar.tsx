import type { LucideIcon } from "lucide-react";

// Figma 15205:153743 — Number avatar (pill with overlapping avatars + "+N")
// Source ratios: avatar 48px, overlap mr-[-20px] (~42%), pill p-1, rounded-full, shadow-sm, bg-background border.
// Adapted avatar size for header contexts: 28px (overlap -12px keeps same ratio).

export type NumberAvatarItem = { key: string; icon: LucideIcon; label?: string };

export function NumberAvatar({
  items,
  extra,
  avatarSize = 28,
  overlap = 12,
  onClick,
}: {
  items: NumberAvatarItem[];
  extra: number;
  avatarSize?: number;
  overlap?: number;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="flex items-center rounded-full border border-border bg-background p-1 shadow-sm transition-colors hover:bg-muted"
    >
      <div className="flex items-start" style={{ paddingRight: overlap }}>
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.key}
              title={it.label}
              className="flex shrink-0 items-center justify-center overflow-clip rounded-full border-2 border-background bg-muted text-muted-foreground"
              style={{ width: avatarSize, height: avatarSize, marginRight: -overlap }}
            >
              <Icon className="size-4" aria-hidden />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center px-2">
        <span className="whitespace-nowrap text-[12px] font-normal leading-4 text-foreground">
          +{extra}
        </span>
      </div>
    </Wrapper>
  );
}
