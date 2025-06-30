import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { orderRecordsAtom } from "@/atoms"
import { TRANSACTION_TYPE } from "@/types"

export default function TotalOrderPreviewPanel() {
  const { t } = useTranslation("report")

  const orderRecords = useAtomValue(orderRecordsAtom)

  // Calculate totals for different types of orders
  const totals = orderRecords.reduce(
    (acc, record) => {
      const isRefund =
        record.total < 0 &&
        record.items.some((item) =>
          item.name.startsWith(`${TRANSACTION_TYPE.REFUND} `),
        )

      const isExpense =
        record.total < 0 &&
        record.items.some((item) =>
          item.name.startsWith(`${TRANSACTION_TYPE.EXPENSE} `),
        )

      const isSale = record.total > 0

      if (isRefund) {
        acc.refunds += Math.abs(record.total)
        acc.refundCount += 1
      } else if (isExpense) {
        acc.expenses += Math.abs(record.total)
        acc.expenseCount += 1
      } else if (isSale) {
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

  const ordersCount = orderRecords.length

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
