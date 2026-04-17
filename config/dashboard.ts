import type { LucideIcon } from "lucide-react";
import { CreditCard, LayoutDashboard, MapPinned, Users } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const dashboardNav: NavItem[] = [
  { title: "Home", href: "/", icon: LayoutDashboard },
  { title: "Mon parc", href: "/parc", icon: MapPinned },
  { title: "Transactions", href: "/transactions", icon: CreditCard },
  { title: "Utilisateurs", href: "/utilisateurs", icon: Users },
];
