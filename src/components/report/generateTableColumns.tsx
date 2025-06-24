import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import type { TFunction } from "i18next"

import type { OrderRecord } from "@/types"

import ActionButtons from "./ActionButtons"

export default function generateTableColumns(t: TFunction) {
  return [
    {
      accessorKey: "created_at",
      header: t("column_date"),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string)
        return format(date, "dd/MM/yyyy HH:mm")
      },
    },
    {
      accessorKey: "items",
      header: t("column_items"),
      cell: ({ row }) => {
        const items = row.getValue("items") as OrderRecord["items"]
        return (
          <div className="flex flex-col gap-1">
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
        return <div>€ {total.toFixed(2)}</div>
      },
    },
    {
      accessorKey: "recived_account",
      header: t("column_recived_account"),
    },
    {
      header: t("column_actions"),
      cell: ({ row }) => <ActionButtons row={row} />,
    },
  ] as ColumnDef<OrderRecord>[]
}

