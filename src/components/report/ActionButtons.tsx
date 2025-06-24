import { IconArrowBackUp, IconTrash } from "@tabler/icons-react"
import type { Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { useAtom } from "jotai"
import { v4 as uuid } from "uuid"

import { orderRecordsAtom } from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import type { OrderRecord } from "@/types"

interface ActionButtonsProps {
  row: Row<OrderRecord>
}

export default function ActionButtons({ row }: ActionButtonsProps) {
  const [orderRecords, setOrderRecords] = useAtom(orderRecordsAtom)

  const total = row.getValue("total") as number
  const recivedAccount = row.getValue("recived_account") as string
  const id = row.original.id
  const canRefund = row.original.is_refunded

  function handleRefundOrder() {
    const timestamp = new Date()

    const refundOrder: OrderRecord = {
      id: uuid(),
      items: [
        {
          id: uuid(),
          name: id,
          quantity: "-1",
          price: total.toString(),
        },
      ],
      total: total * -1,
      created_at: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss"),
      recived_account: recivedAccount,
      is_refunded: false,
    }

    const markedOrderAsRefunded = {
      ...row.original,
      is_refunded: true,
    }

    const modifiedOrders = [refundOrder, ...orderRecords]

    setOrderRecords(
      modifiedOrders.map((order) =>
        order.id === id ? markedOrderAsRefunded : order,
      ),
    )
  }

  function handleRemoveOrder() {
    const originalOrderId = row.original.items[0].name
    const originalOrderIdx = orderRecords.findIndex(
      (order) => order.id === originalOrderId,
    )

    if (originalOrderIdx !== -1) {
      const modifiedOrders = [...orderRecords]
      modifiedOrders[originalOrderIdx].is_refunded = false
      setOrderRecords(modifiedOrders.filter((order) => order.id !== id))
      return
    }

    setOrderRecords((records) => records.filter((record) => record.id !== id))
  }

  return (
    <div className="flex items-center gap-2">
      {total > 0 ? (
        <AnimatedButton
          variant="outline"
          onClick={handleRefundOrder}
          disabled={canRefund}
        >
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
