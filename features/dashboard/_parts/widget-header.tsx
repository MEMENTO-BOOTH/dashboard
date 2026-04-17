import { EllipsisVertical } from "lucide-react";

// Figma widget header — verbatim:
// Flex items-start justify-between px-[24px] w-full
// Left (Flex vertical): gap-[4px]
//   Title: font Inter SemiBold 600, leading-[28px], text-[18px] card-foreground
//   Subtitle: font Inter Regular 400, leading-[20px], text-[14px] muted-foreground
// Right: ellipsis-vertical icon size-[16px]

export function WidgetHeader({
  title,
  subtitle,
  leadingIcon,
}: {
  title: string;
  subtitle?: string;
  leadingIcon?: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-start justify-between gap-2 px-6">
      <div className="flex flex-1 items-center gap-2">
        {leadingIcon ? <span className="shrink-0 [&_svg]:size-6">{leadingIcon}</span> : null}
        <div className="flex flex-col gap-1">
          <p className="text-[18px] font-semibold leading-[28px] text-card-foreground">{title}</p>
          {subtitle ? (
            <p className="text-[14px] font-normal leading-5 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        aria-label="More options"
        className="text-muted-foreground hover:text-foreground"
      >
        <EllipsisVertical className="size-4" />
      </button>
    </div>
  );
}
