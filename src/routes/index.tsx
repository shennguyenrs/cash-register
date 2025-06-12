import { createFileRoute } from "@tanstack/react-router"

import ButtonsSection from "@/components/home/ButtonsSection"
import MenuSection from "@/components/home/MenuSection"
import NumpadSection from "@/components/home/NumpadSection"
import OrderPreview from "@/components/home/OrderPreview"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="h-screen w-screen p-2">
      <div className="grid h-8/10 grid-cols-3 gap-2">
        <MenuSection />
        <NumpadSection />
        <OrderPreview />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <ButtonsSection />
      </div>
    </div>
  )
}
