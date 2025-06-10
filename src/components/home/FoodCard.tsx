import { useAtom, useAtomValue } from "jotai"
import { motion } from "motion/react"

import { searchMenuItemAtom, selectedMenuItemIdxAtom } from "@/atoms"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types"

interface FoodCardProps {
  item: MenuItem
}

export default function FoodCard({ item }: FoodCardProps) {
  const [selectedIdx, setSelectedIdx] = useAtom(selectedMenuItemIdxAtom)
  const searchTerm = useAtomValue(searchMenuItemAtom)

  function handleToggleSelectItem() {
    if (selectedIdx === item.id) {
      setSelectedIdx(0)
      return
    }
    setSelectedIdx(item.id)
  }

  function highlightSearchTerm(text: string, term: string) {
    if (!term) return text
    const regex = new RegExp(`(${term})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-300 text-black">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      key={item.id}
      layout
    >
      <div
        className={cn(
          "relative min-h-[80px] rounded-md border-2 border-solid p-1",
          selectedIdx === item.id && "bg-neutral-800 text-white",
        )}
        onClick={handleToggleSelectItem}
      >
        <p>{highlightSearchTerm(item.name, searchTerm)}</p>
        <div className="absolute right-0 bottom-0 pr-1">
          <p className="text-neutral-400">€ {item.price}</p>
        </div>
      </div>
    </motion.div>
  )
}
