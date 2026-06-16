import { Activity, Languages } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { NotificationsBell } from "@/features/notifications";

export function NavbarActions() {
  return (
    <div className="flex items-center gap-1.5">
      <IconButton variant="ghost" size="md" aria-label="Language">
        <Languages />
      </IconButton>
      <IconButton variant="ghost" size="md" aria-label="Activity">
        <Activity />
      </IconButton>
      <NotificationsBell />
    </div>
  );
}
