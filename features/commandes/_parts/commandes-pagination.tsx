"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import type { CommandeListRow } from "../schemas";

export function CommandesPagination({ table }: { table: Table<CommandeListRow> }) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 2,
  });
  const { pageIndex, pageSize } = table.getState().pagination;
  const from = pageIndex * pageSize + 1;
  const to = Math.min(Math.max(pageIndex * pageSize + pageSize, 0), table.getRowCount());

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col">
      <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
        Affichage de{" "}
        <span>
          {from} à {to}
        </span>{" "}
        sur <span>{table.getRowCount().toString()} commandes</span>
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Page précédente"
            >
              <ChevronLeftIcon aria-hidden="true" />
              Précédent
            </Button>
          </PaginationItem>

          {showLeftEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pages.map((page) => {
            const isActive = page === pageIndex + 1;
            return (
              <PaginationItem key={page}>
                <Button
                  size="icon"
                  className={`${!isActive && "bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40"}`}
                  onClick={() => table.setPageIndex(page - 1)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Button>
              </PaginationItem>
            );
          })}

          {showRightEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <Button
              variant="ghost"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Page suivante"
            >
              Suivant
              <ChevronRightIcon aria-hidden="true" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
