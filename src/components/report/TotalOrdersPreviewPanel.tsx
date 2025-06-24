import { useAtomValue } from "jotai"
import { useTranslation } from "react-i18next"

import { orderRecordsAtom } from "@/atoms"

export default function TotalOrderPreviewPanel() {
  const { t } = useTranslation("report")

  const orderRecords = useAtomValue(orderRecordsAtom)
  const ordersCount = orderRecords.length
  const totalSales = orderRecords.reduce((acc, record) => acc + record.total, 0)

  return (
    <div className="bg-primary rounded-md p-4 text-white">
      <p>
        <span className="font-bold">{t("order_count")}:</span> {ordersCount}
      </p>
      <p>
        <span className="font-bold">{t("total_sales")}:</span> € {totalSales}
      </p>
    </div>
  )
}
