import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { orderRecordsAtom, menuListAtom } from "@/atoms"
import { isTransactionType } from "@/lib/utils"
import { TRANSACTION_TYPE } from "@/types"

export default function TotalOrderPreviewPanel() {
  const { t } = useTranslation("report")

  const orderRecords = useAtomValue(orderRecordsAtom)
  const menuList = useAtomValue(menuListAtom)

  // Memoize expensive calculations to avoid recalculating on every render
  const { totals, ordersCount } = useMemo(() => {
    const calculatedTotals = orderRecords.reduce(
      (acc, record) => {
        if (isTransactionType(record, TRANSACTION_TYPE.REFUND)) {
          acc.refunds += Math.abs(record.total)
          acc.refundCount += 1
        } else if (isTransactionType(record, TRANSACTION_TYPE.EXPENSE)) {
          acc.expenses += Math.abs(record.total)
          acc.expenseCount += 1
        } else if (isTransactionType(record, TRANSACTION_TYPE.SALE)) {
          acc.sales += record.total
          acc.salesCount += 1
        }

        return acc
      },
      {
        sales: 0,
        refunds: 0,
        expenses: 0,
        salesCount: 0,
        refundCount: 0,
        expenseCount: 0,
      },
    )

    return {
      totals: calculatedTotals,
      ordersCount: orderRecords.length,
    }
  }, [orderRecords])

  // Calculate top 3 selling items
  const topSellingItems = useMemo(() => {
    const itemQuantities: Record<string, number> = {}

    for (let i = 0; i < orderRecords.length; i++) {
      const record = orderRecords[i]
      if (record.total > 0 && !record.is_refunded) {
        for (let j = 0; j < record.items.length; j++) {
          const item = record.items[j]
          if (
            !item.name.startsWith(TRANSACTION_TYPE.REFUND) &&
            !item.name.startsWith(TRANSACTION_TYPE.EXPENSE)
          ) {
            const itemId = item.id
            const quantity = Number(item.quantity) || 0
            itemQuantities[itemId] = (itemQuantities[itemId] || 0) + quantity
          }
        }
      }
    }

    if (Object.keys(itemQuantities).length === 0) {
      return []
    }

    const sortedItems = Object.entries(itemQuantities)
      .map(([itemId, quantity]) => {
        const menuItem = menuList.find((item) => item.id === itemId)
        return {
          name: menuItem?.name,
          quantity,
        }
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3)

    return sortedItems
  }, [orderRecords, menuList])

  return (
    <div className="bg-primary rounded-md p-4 text-white">
      <p>
        <span className="font-bold">{t("order_count")}:</span> {ordersCount}
      </p>
      <p>
        <span className="font-bold">{t("total_sales")}:</span> €{" "}
        {totals.sales.toFixed(2)} ({totals.salesCount})
      </p>
      <p>
        <span className="font-bold">{t("total_refunds")}:</span> €{" "}
        {totals.refunds.toFixed(2)} ({totals.refundCount})
      </p>
      <p>
        <span className="font-bold">{t("total_expenses")}:</span> €{" "}
        {totals.expenses.toFixed(2)} ({totals.expenseCount})
      </p>
      <div className="mt-4 border-t border-white/20 pt-4">
        <p className="mb-2 font-bold">{t("top_selling_items")}:</p>
        {topSellingItems.length > 0 ? (
          topSellingItems.map((item, index) => (
            <p key={index} className="text-sm">
              {index + 1}. {item.name} ({t("quantity_sold")}: {item.quantity})
            </p>
          ))
        ) : (
          <p className="text-sm italic">{t("no_items_sold")}</p>
        )}
      </div>
    </div>
  )
}
