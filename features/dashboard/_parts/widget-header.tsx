import { EllipsisVertical } from "lucide-react";

// Figma widget header — verbatim:
// Flex items-start justify-between px-[24px] w-full
// Left (Flex vertical): gap-[4px]
//   Title: font Inter SemiBold 600, leading-[28px], text-[18px] card-foreground
//   Subtitle: font Inter Regular 400, leading-[20px], text-[14px] muted-foreground
// Right: trailing icon size-[16px] (par défaut: ellipsis vertical)

export function WidgetHeader({
  title,
  subtitle,
  leadingIcon,
  trailingIcon,
  trailingLabel = "More options",
  onTrailingClick,
}: {
  title: string;
  subtitle?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingLabel?: string;
  onTrailingClick?: () => void;
}) {
  return (
    <div className="flex w-full items-start justify-between gap-2 px-6">
      <div className="flex min-w-0 flex-1 items-start gap-2">
        {leadingIcon ? (
          <span className="flex h-7 shrink-0 items-center [&_svg]:size-6">{leadingIcon}</span>
        ) : null}
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-[18px] font-semibold leading-[28px] text-card-foreground">{title}</p>
          {subtitle ? (
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onTrailingClick}
        aria-label={trailingLabel}
        title={trailingLabel}
        className="flex h-7 shrink-0 items-center rounded-[6px] px-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-4"
      >
        {trailingIcon ?? <EllipsisVertical className="size-4" />}
      </button>
    </div>
  );
}
