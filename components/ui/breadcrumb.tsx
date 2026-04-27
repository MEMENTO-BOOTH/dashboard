import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2.5 py-4" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={item.label} className="flex items-center gap-2.5">
            {i > 0 ? (
              <ChevronRight className="size-[14px] shrink-0 text-muted-foreground" />
            ) : null}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="whitespace-nowrap text-[14px] font-normal leading-5 text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="whitespace-nowrap text-[14px] font-medium leading-5 text-foreground"
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
