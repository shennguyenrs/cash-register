import { IconArrowBackUp, IconTrash } from "@tabler/icons-react"
import type { Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { useAtom, useSetAtom } from "jotai"
import { v4 as uuid } from "uuid"

import { adjustStockForOrderAtom, orderRecordsAtom } from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import {
  createTransactionName,
  extractOriginalIdentifier,
  isTransactionType,
} from "@/lib/utils"
import { type OrderRecord, TRANSACTION_TYPE } from "@/types"

interface ActionButtonsProps {
  row: Row<OrderRecord>
}

export default function ActionButtons({ row }: ActionButtonsProps) {
  const [orderRecords, setOrderRecords] = useAtom(orderRecordsAtom)
  const adjustStock = useSetAtom(adjustStockForOrderAtom)

  const total = row.getValue("total") as number
  const recivedAccount = row.getValue("recived_account") as string
  const id = row.original.id
  const canRefund = row.original.is_refunded

  function handleRefundOrder() {
    const timestamp = new Date()

    // Restore stock for the refunded items
    adjustStock({ orderItems: row.original.items, isAdding: true })

    const refundOrder: OrderRecord = {
      id: uuid(),
      items: [
        {
          id: uuid(),
          name: createTransactionName(TRANSACTION_TYPE.REFUND, id),
          quantity: "-1",
          price: total.toString(),
          stock: "0",
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
    // For refunds, we need to find and unremark the original order
    if (isTransactionType(row.original, TRANSACTION_TYPE.REFUND)) {
      const itemName = row.original.items[0].name
      const originalOrderId = extractOriginalIdentifier(
        itemName,
        TRANSACTION_TYPE.REFUND,
      )
      const originalOrderIdx = orderRecords.findIndex(
        (order) => order.id === originalOrderId,
      )

      if (originalOrderIdx !== -1) {
        const modifiedOrders = [...orderRecords]
        const originalOrder = modifiedOrders[originalOrderIdx]

        adjustStock({ orderItems: originalOrder.items })

        modifiedOrders[originalOrderIdx].is_refunded = false
        setOrderRecords(modifiedOrders.filter((order) => order.id !== id))
        return
      }
    }

    // For expenses and other transactions, just remove the record
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
