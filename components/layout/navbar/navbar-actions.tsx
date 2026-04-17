import { Activity, Bell, Languages } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

// Figma 16460:50941 — Row flex-1 justify-end gap-6
// Actions 16460:50942 — gap-1.5 flex items-center
// 3 Ghost Icon Buttons (size md, p-2 rounded-md) with 16x16 icons
// Dot badge 16460:50951 — absolute left-[89px] top-[4px] rounded-full px-1 gap-1.5

export function NavbarActions() {
  return (
    <div className="relative flex items-center gap-1.5">
      <IconButton variant="ghost" size="md" aria-label="Language">
        <Languages />
      </IconButton>
      <IconButton variant="ghost" size="md" aria-label="Activity">
        <Activity />
      </IconButton>
      <IconButton variant="ghost" size="md" aria-label="Notifications">
        <Bell />
      </IconButton>
      <span
        aria-hidden
        className="pointer-events-none absolute left-[89px] top-[4px] flex items-center justify-center gap-1.5 rounded-full bg-destructive px-1"
      >
        <span className="size-2 rounded-full bg-destructive" />
      </span>
    </div>
  );
}
