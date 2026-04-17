import {
  Bell,
  Bookmark,
  MoreHorizontal,
  RefreshCw,
  Search,
  Share2,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Section } from "./_parts";

export function ExampleSection() {
  return (
    <Section title="Example">
      <div className="flex flex-1 flex-wrap items-center gap-[30px]">
        <IconButton variant="outline" color="info" shape="rounded" aria-label="Refresh">
          <RefreshCw />
        </IconButton>
        <IconButton variant="outline" color="success" shape="rounded" aria-label="Bookmark">
          <Bookmark />
        </IconButton>
        <IconButton variant="solid" color="destructive" aria-label="Delete">
          <Trash2 />
        </IconButton>
        <IconButton variant="ghost" aria-label="Share">
          <Share2 />
        </IconButton>
        <IconButton variant="outline" color="destructive" shape="rounded" aria-label="Remove">
          <Trash2 />
        </IconButton>
        <IconButton variant="ghost" color="warning" aria-label="Notifications">
          <Bell />
        </IconButton>
        <IconButton variant="soft" color="success" aria-label="Trend">
          <TrendingUp />
        </IconButton>
        <IconButton variant="soft" aria-label="Chart">
          <TrendingUp />
        </IconButton>
        <IconButton variant="solid" aria-label="More">
          <MoreHorizontal />
        </IconButton>
        <IconButton variant="outline" aria-label="Search">
          <Search />
        </IconButton>
        <IconButton variant="ghost" aria-label="Star">
          <Star />
        </IconButton>
      </div>
    </Section>
  );
}
