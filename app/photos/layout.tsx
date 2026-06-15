import type { ReactNode } from "react";
import { loos, loosWide } from "./fonts";

export default function PhotosLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${loos.variable} ${loosWide.variable} min-h-screen bg-[#fdf2da] text-[#00109f]`}
      style={{ fontFamily: "var(--font-loos), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
