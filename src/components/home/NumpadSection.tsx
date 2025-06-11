import { IconBackspace } from "@tabler/icons-react"
import { useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"

import { menuListAtom, newOrderAtom, selectedMenuItemIdAtom } from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import type { OrderItem } from "@/types"

export default function NumpadSection() {
  const [inputValue, setInputValue] = useState("0")
  const selectedMenuItemId = useAtomValue(selectedMenuItemIdAtom)
  const menu = useAtomValue(menuListAtom)
  const setNewOrder = useSetAtom(newOrderAtom)

  function handleNumberClick(number: string) {
    if (inputValue === "0") {
      setInputValue(number)
      return
    }
    setInputValue((prev) => prev + number)
  }

  function handleBackspace() {
    if (inputValue === "0") return
    if (inputValue.length === 1) {
      setInputValue("0")
      return
    }
    setInputValue((prev) => prev.slice(0, -1))
  }

  function handleEnter() {
    const selectedMenuItem = menu.find((i) => i.id === selectedMenuItemId)
    if (!selectedMenuItem) return
    const newOrder = {
      ...selectedMenuItem,
      quantity: inputValue,
    } as OrderItem
    setNewOrder((prev) => [...prev, newOrder])
    setInputValue("0")
  }

  return (
    <>
      <div className="m-2 rounded-md border-2 border-solid p-4 text-right text-4xl">
        {inputValue}
      </div>
      <div className="grid h-8/10 grid-cols-3 gap-2 p-2">
        {[...Array(9)].map((_, i) => (
          <AnimatedButton
            key={i + 1}
            onClick={() => handleNumberClick(String(i + 1))}
            className="h-full w-full text-4xl"
            variant="outline"
          >
            {i + 1}
          </AnimatedButton>
        ))}
        <AnimatedButton
          onClick={() => handleNumberClick("0")}
          className="h-full w-full text-4xl"
          variant="outline"
        >
          0
        </AnimatedButton>
        <AnimatedButton
          onClick={handleBackspace}
          className="h-full w-full bg-amber-500 hover:bg-amber-300"
        >
          <IconBackspace className="!h-12 !w-12" />
        </AnimatedButton>
        <AnimatedButton
          onClick={handleEnter}
          className="h-full w-full bg-emerald-400 text-4xl hover:bg-emerald-300"
          disabled={!selectedMenuItemId}
        >
          Enter
        </AnimatedButton>
      </div>
    </>
  )
}
