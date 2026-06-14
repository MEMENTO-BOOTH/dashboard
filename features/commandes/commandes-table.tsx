"use client";

import type { PaginationState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderCard } from "@/lib/stripe";
import { buildCommandeColumns } from "./_parts/commandes-columns";
import { CommandesPagination } from "./_parts/commandes-pagination";
import type { CommandeListRow } from "./schemas";

const PAGE_SIZE = 5;
const FILLER_KEYS = ["filler-a", "filler-b", "filler-c", "filler-d", "filler-e"];

export function CommandesTable({
  rows,
  cards,
}: {
  rows: CommandeListRow[];
  cards: Record<string, OrderCard>;
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const columns = buildCommandeColumns(cards);
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  });
  const pageRows = table.getRowModel().rows;
  const fillers = FILLER_KEYS.slice(0, Math.max(0, PAGE_SIZE - pageRows.length));

  return (
    <div className="w-full">
      <div className="border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground h-14 first:pl-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              <>
                {pageRows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="h-14 first:pl-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {fillers.map((key) => (
                  <TableRow key={key} aria-hidden="true">
                    <TableCell colSpan={columns.length} className="h-14" />
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[280px] text-center text-muted-foreground"
                >
                  Aucune commande.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CommandesPagination table={table} />
    </div>
  );
}
