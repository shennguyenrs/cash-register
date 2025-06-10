import { createFileRoute } from "@tanstack/react-router"

import ButtonsSection from "@/components/home/ButtonsSection"
import MenuSection from "@/components/home/MenuSection"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="h-screen w-screen p-2">
      <div className="grid h-8/10 grid-cols-3 gap-2">
        <MenuSection />
        <div className="rounded-md border-2 border-solid"></div>
        <div className="rounded-md border-2 border-solid"></div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <ButtonsSection />
      </div>
    </div>
  )
}
