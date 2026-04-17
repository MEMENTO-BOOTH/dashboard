import { ChevronRight } from "lucide-react";

// Figma 39589:2840 Footer — verbatim:
// "absolute bottom-[-1px] left-[-1px] right-[-1px]
//  content-stretch flex flex-col gap-[0px] h-[68px] items-center
//  p-[8px] rounded-[6px]"
//
// 39589:2841 Collapsible:
// "content-stretch flex gap-[8px] items-center p-[8px]
//  relative rounded-[6px] shrink-0 w-full"
//
// Avatar (via Avatar component):
// "overflow-clip relative rounded-[10px] shrink-0 size-[32px]"
// Image: full absolute inset-0, object-cover
//
// Name (39589:2844): font 'Inter:Medium' 500, leading-[20px], text-[14px]
// Role (39589:2845): font 'Inter:Light' 300, leading-[16px], text-[12px]
//
// Dropdown icon (39589:2847): size-[16px] ChevronRight

export type SidebarFooterProps = {
  name: string;
  role: string;
  avatarUrl: string;
};

export function SidebarFooter({ name, role, avatarUrl }: SidebarFooterProps) {
  return (
    <div className="absolute -bottom-px -left-px -right-px flex h-[68px] flex-col items-center gap-0 rounded-[6px] bg-background p-2">
      <button
        type="button"
        title={name}
        className="flex w-full items-center gap-2 rounded-[6px] p-2 transition-colors hover:bg-sidebar-accent group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:p-1"
      >
        <div className="relative size-8 shrink-0 overflow-clip rounded-[10px] bg-muted">
          {/* biome-ignore lint/performance/noImgElement: external avatar URL */}
          <img
            src={avatarUrl}
            alt={name}
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start text-left text-sidebar-foreground group-data-[collapsed]/sidebar:hidden">
          <p className="w-full truncate text-[14px] font-medium leading-5">{name}</p>
          <p className="w-full truncate text-[12px] font-light leading-4">{role}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 opacity-60 group-data-[collapsed]/sidebar:hidden" />
      </button>
    </div>
  );
}
