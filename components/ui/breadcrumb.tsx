import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

// Figma 39560:211574 — Breadcrumb
// Container: flex gap-3 items-center py-4
// Home icon: size-[18px]
// Separator: ChevronRight size-[14px]
// Links: 14px Regular text-secondary-foreground
// Last item: same style (no special "active" treatment in Figma)

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2.5 py-4" aria-label="Breadcrumb">
      <Link href="/" className="shrink-0 text-secondary-foreground hover:text-foreground">
        <Home className="size-[18px]" />
      </Link>
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <ChevronRight className="size-[14px] shrink-0 text-muted-foreground" />
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="whitespace-nowrap text-[14px] font-normal leading-5 text-secondary-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="whitespace-nowrap text-[14px] font-normal leading-5 text-secondary-foreground">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
