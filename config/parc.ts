import type { LucideIcon } from "lucide-react";
import { Monitor } from "lucide-react";

export type ParcNavItem = {
  title: string;
  href: string;
};

export type ParcNavSection = {
  title: string;
  icon: LucideIcon;
  href: string;
  defaultOpen?: boolean;
  items: ParcNavItem[];
};

export const parcNav: ParcNavSection[] = [
  {
    title: "Borne",
    icon: Monitor,
    href: "/parc/bornes",
    defaultOpen: true,
    items: [
      { title: "Bornes", href: "/parc/bornes" },
      { title: "Interventions", href: "/parc/interventions" },
    ],
  },
];
