import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import type { TFunction } from "i18next"

import { cn } from "@/lib/utils"
import type { OrderRecord } from "@/types"

import ActionButtons from "./ActionButtons"

export default function generateTableColumns(t: TFunction) {
  return [
    {
      accessorKey: "created_at",
      header: t("column_date"),
      cell: ({ row }) => {
        const total = row.getValue("total") as number
        const date = new Date(row.getValue("created_at") as string)
        return (
          <div className={cn([total < 0 ? "text-red-500" : ""])}>
            {format(date, "dd/MM/yyyy HH:mm")}
          </div>
        )
      },
    },
    {
      accessorKey: "items",
      header: t("column_items"),
      cell: ({ row }) => {
        const total = row.getValue("total") as number
        const items = row.getValue("items") as OrderRecord["items"]
        return (
          <div
            className={cn([
              "flex flex-col gap-1",
              total < 0 ? "text-red-500" : "",
            ])}
          >
            {items.map((item) => (
              <div key={item.id}>
                {item.name} (x{item.quantity})
              </div>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: "total",
      header: t("column_total"),
      cell: ({ row }) => {
        const total = row.getValue("total") as number
        return (
          <div className={cn([total < 0 ? "text-red-500" : ""])}>
            € {total.toFixed(2)}
          </div>
        )
      },
    },
    {
      accessorKey: "recived_account",
      header: t("column_recived_account"),
      cell: ({ row }) => {
        const recivedAccount = row.getValue("recived_account") as string
        const total = row.getValue("total") as number
        return (
          <div className={cn([total < 0 ? "text-red-500" : ""])}>
            {recivedAccount}
          </div>
        )
      },
    },
    {
      header: t("column_actions"),
      cell: ({ row }) => <ActionButtons row={row} />,
    },
  ] as ColumnDef<OrderRecord>[]
}
