import { useAtomValue } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { orderRecordsAtom } from "@/atoms"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseCreatedAt } from "@/lib/utils"

export default function SalesLineChart() {
  const { t } = useTranslation("report")

  const orderRecords = useAtomValue(orderRecordsAtom)

  const [timeRange, setTimeRange] = useState("6")

  function processData() {
    const hours = parseInt(timeRange)
    const now = new Date()
    const timeRangeStart = new Date(now.getTime() - hours * 60 * 60 * 1000)

    // Filter and group data by hour
    const filteredData = orderRecords
      .filter((record) => {
        const safeDate = parseCreatedAt(record.created_at)
        return safeDate >= timeRangeStart
      })
      .reduce(
        (acc, record) => {
          const safeDate = parseCreatedAt(record.created_at)
          const hour = safeDate.getHours()
          acc[hour] = (acc[hour] || 0) + record.total
          return acc
        },
        {} as Record<number, number>,
      )

    // Create data points for each hour in the range
    const data = []

    for (let i = 0; i < hours; i++) {
      const hourIndex = (now.getHours() - i + 24) % 24
      data.unshift({
        hour: `${hourIndex}:00`,
        sales: filteredData[hourIndex] || 0,
      })
    }

    return data
  }

  const chartData = processData()

  return (
    <>
      <div className="flex items-center justify-end gap-2 pr-4">
        <span>{t("time_range")}</span>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t("select_last_hours")} />
          </SelectTrigger>
          <SelectContent>
            {[1, 3, 6, 12].map((hours) => (
              <SelectItem key={hours} value={hours.toString()}>
                {t("last_hours", { hours })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px] w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#0a0a0a"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
