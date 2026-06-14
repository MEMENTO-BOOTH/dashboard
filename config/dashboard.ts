import type { LucideIcon } from "lucide-react";
import {
  ChartNoAxesCombined,
  Coins,
  LayoutDashboard,
  Mailbox,
  MapPinned,
  Users,
} from "lucide-react";
import type { Permission } from "@/features/auth/permissions";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: Permission;
  disabled?: boolean;
};

export const dashboardNav: NavItem[] = [
  { title: "Home", href: "/", icon: LayoutDashboard },
  { title: "Postal", href: "/postal", icon: Mailbox },
  { title: "Mon parc", href: "/parc", icon: MapPinned },
  { title: "Jetons", href: "/jetons", icon: Coins, requiredPermission: "jetons.view" },
  {
    title: "Finance",
    href: "/transactions",
    icon: ChartNoAxesCombined,
    requiredPermission: "finance.view",
  },
  {
    title: "Utilisateurs",
    href: "/utilisateurs",
    icon: Users,
    requiredPermission: "utilisateurs.manage",
  },
];
