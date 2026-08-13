import { dashboardNav } from "@/config/dashboard";
import { can, type Permissions } from "@/features/auth/permissions";
import { SidebarFooter, type SidebarFooterProps } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarItem } from "./sidebar-item";

export function Sidebar({
  collapsed = false,
  user,
  permissions,
}: {
  collapsed?: boolean;
  user: SidebarFooterProps;
  permissions: Permissions;
}) {
  const items = dashboardNav.filter(
    (item) => !item.requiredPermission || can(permissions, item.requiredPermission),
  );

  return (
    <aside
      data-collapsed={collapsed || undefined}
      className="group/sidebar relative flex h-full w-full flex-col items-start overflow-clip border-r border-sidebar-border bg-background"
      data-slot="sidebar"
    >
      <SidebarHeader />

      <div className="flex w-full flex-1 flex-col items-start gap-1.5 overflow-y-auto p-3 pb-[76px]">
        {items.map((item) => (
          <SidebarItem key={item.href} href={item.href} icon={<item.icon />} label={item.title} />
        ))}
      </div>

      <SidebarFooter name={user.name} role={user.role} avatarUrl={user.avatarUrl} />
    </aside>
  );
}
