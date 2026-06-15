import localFont from "next/font/local";

export const loos = localFont({
  src: [
    { path: "../../fonts/loos/Loos-Regular.otf", weight: "400", style: "normal" },
    { path: "../../fonts/loos/Loos-Medium.otf", weight: "500", style: "normal" },
    { path: "../../fonts/loos/Loos-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-loos",
  display: "swap",
});

export const loosWide = localFont({
  src: [
    { path: "../../fonts/loos-wide/LoosWide-Medium.otf", weight: "500", style: "normal" },
    { path: "../../fonts/loos-wide/LoosWide-Bold.otf", weight: "700", style: "normal" },
    { path: "../../fonts/loos-wide/LoosWide-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-loos-wide",
  display: "swap",
});
