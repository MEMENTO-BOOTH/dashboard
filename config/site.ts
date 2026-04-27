export const siteConfig = {
  name: "Capsule",
  description: "Dashboard de supervision Capsule",
  url: "https://capsule-dashboard.vercel.app",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/collins732/capsule-dashboard",
  },
} as const;

export type SiteConfig = typeof siteConfig;
