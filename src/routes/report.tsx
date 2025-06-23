import { createFileRoute } from "@tanstack/react-router"

import GoBackButton from "@/components/GoBackButton"
import SalesLineChart from "@/components/report/SalesLineChart"

export const Route = createFileRoute("/report")({
  component: Report,
})

function Report() {
  return (
    <div className="h-screen w-screen p-2">
      <GoBackButton />
      <SalesLineChart />
    </div>
  )
}
