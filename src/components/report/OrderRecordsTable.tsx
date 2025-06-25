import {
  IconArrowsSort,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react"
import type { SortingState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { orderRecordsAtom } from "@/atoms"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import generateTableColumns from "./generateTableColumns"

export default function OrderRecordsTable() {
  const { t } = useTranslation("report")
  const data = useAtomValue(orderRecordsAtom)

  const [sorting, setSorting] = useState<SortingState>([])

  const columns = generateTableColumns(t)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  function renderSortIcon(column: {
    getIsSorted: () => false | "asc" | "desc"
  }) {
    return column.getIsSorted() === "asc" ? (
      <IconSortAscendingLetters size={16} />
    ) : column.getIsSorted() === "desc" ? (
      <IconSortDescendingLetters size={16} />
    ) : (
      <IconArrowsSort size={16} />
    )
  }

  return (
    <div
      data-slot="table-container"
      className="relative max-h-[45vh] overflow-auto rounded-md border-2"
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex cursor-pointer items-center gap-1 select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() &&
                          renderSortIcon(header.column)}
                      </div>
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t("no_records")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
