// Figma 39589:2774 Section — verbatim:
// "content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-full"
//
// 39589:2775 Label container:
// "content-stretch flex flex-col h-[32px] items-start justify-center
//  opacity-70 px-[8px] relative shrink-0 w-full"
//
// 39589:2776 Label text:
// font 'Inter:Medium' 500, leading-[16px], text-[12px]
// text-[color:var(--sidebar-foreground,#404040)]
//
// 39589:2777 Items wrapper:
// "content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full"

export function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start p-2">
      <div className="flex h-8 w-full flex-col items-start justify-center px-2 opacity-70 group-data-[collapsed]/sidebar:hidden">
        <p className="w-full text-[12px] font-medium leading-4 text-sidebar-foreground">{label}</p>
      </div>
      <div className="flex w-full flex-col items-start gap-1">{children}</div>
    </div>
  );
}
