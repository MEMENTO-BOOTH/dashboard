export const siteConfig = {
  name: "Kapsule",
  description: "Dashboard de supervision Kapsule",
  url: "https://capsule-dashboard.vercel.app",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/collins732/capsule-dashboard",
  },
} as const;

export type SiteConfig = typeof siteConfig;
