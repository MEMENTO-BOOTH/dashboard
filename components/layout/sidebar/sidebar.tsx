import { dashboardNav } from "@/config/dashboard";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarItem } from "./sidebar-item";

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <aside
      data-collapsed={collapsed || undefined}
      className="group/sidebar relative flex h-full w-full flex-col items-start overflow-clip border-r border-sidebar-border bg-background"
      data-slot="sidebar"
    >
      <SidebarHeader />

      <div className="flex w-full flex-1 flex-col items-start gap-1 overflow-y-auto p-2 pb-[76px]">
        {dashboardNav.map((item) => (
          <SidebarItem key={item.href} href={item.href} icon={<item.icon />} label={item.title} />
        ))}
      </div>

      <SidebarFooter
        name="Collins"
        role="Développeur"
        avatarUrl="https://www.figma.com/api/mcp/asset/e52bd563-6bb2-4ef4-8139-c0a8f18bb81c"
      />
    </aside>
  );
}
