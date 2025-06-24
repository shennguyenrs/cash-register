import { IconArrowBackUp, IconTrash } from "@tabler/icons-react"
import type { Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { useSetAtom } from "jotai"
import { v4 as uuid } from "uuid"

import { orderRecordsAtom } from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import type { OrderRecord } from "@/types"

interface ActionButtonsProps {
  row: Row<OrderRecord>
}

export default function ActionButtons({ row }: ActionButtonsProps) {
  const setOrderRecords = useSetAtom(orderRecordsAtom)

  const total = row.getValue("total") as number
  const recivedAccount = row.getValue("recived_account") as string
  const id = row.original.id

  function handleRefundOrder() {
    const timestamp = new Date()

    const order: OrderRecord = {
      id: uuid(),
      items: [
        {
          id: uuid(),
          name: `Refund order ${id}`,
          quantity: "-1",
          price: total.toString(),
        },
      ],
      total: total * -1,
      created_at: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss"),
      recived_account: recivedAccount,
    }

    setOrderRecords((prev) => [order, ...prev])
  }

  function handleRemoveOrder() {
    setOrderRecords((records) => records.filter((record) => record.id !== id))
  }

  return (
    <div className="flex items-center gap-2">
      {total > 0 ? (
        <AnimatedButton variant="outline" onClick={handleRefundOrder}>
          <IconArrowBackUp />
        </AnimatedButton>
      ) : (
        <AnimatedButton variant="destructive" onClick={handleRemoveOrder}>
          <IconTrash />
        </AnimatedButton>
      )}
    </div>
  )
}
