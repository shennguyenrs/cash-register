import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { orderRecordsAtom } from "@/atoms"
import { isTransactionType } from "@/lib/utils"
import { TRANSACTION_TYPE } from "@/types"

export default function TotalOrderPreviewPanel() {
  const { t } = useTranslation("report")

  const orderRecords = useAtomValue(orderRecordsAtom)

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
    </div>
  )
}
