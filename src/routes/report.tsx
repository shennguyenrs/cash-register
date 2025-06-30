import { createFileRoute } from "@tanstack/react-router"

import GoBackButton from "@/components/GoBackButton"
import OrderRecordsTable from "@/components/report/OrderRecordsTable"
import SalesLineChart from "@/components/report/SalesLineChart"
import TotalOrderPreviewPanel from "@/components/report/TotalOrdersPreviewPanel"

export const Route = createFileRoute("/report")({
  component: Report,
})

function Report() {
  return (
    <div className="h-screen w-screen p-4">
      <GoBackButton />
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-7">
          <SalesLineChart />
        </div>
        <div className="col-span-1">
          <TotalOrderPreviewPanel />
        </div>
      </div>
      <OrderRecordsTable />
    </div>
  )
}
