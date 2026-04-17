// Figma 39589:2768 Sidebar header — verbatim classes:
// "content-stretch flex flex-col gap-[0px] items-center justify-center
//  px-[8px] py-[6px] relative rounded-[6px] shrink-0 w-full"
//
// 39589:2769 Collapsible:
// "content-stretch flex gap-[8px] items-center p-[8px]
//  relative rounded-[6px] shrink-0 w-full"
//
// Logo: 32x32 rounded (Memento brand image)
// App name: font Inter SemiBold 600, leading-[28px], text-[18px] sidebar-foreground

export function SidebarHeader() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-0 rounded-[6px] px-2 py-1.5">
      <div className="flex w-full items-center gap-2 rounded-[6px] p-2 group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:p-1">
        <div className="flex h-8 items-center gap-3 shrink-0">
          <div className="relative size-8 overflow-clip rounded-full bg-background">
            {/* biome-ignore lint/performance/noImgElement: local static asset */}
            <img
              src="/memento-logo.png"
              alt="Memento"
              className="pointer-events-none absolute inset-0 size-full object-contain"
            />
          </div>
        </div>
        <p className="min-w-0 flex-1 whitespace-nowrap text-[18px] font-semibold leading-[28px] text-sidebar-foreground group-data-[collapsed]/sidebar:hidden">
          Memento
        </p>
      </div>
    </div>
  );
}
