import { useAtom, useAtomValue } from "jotai"
import { motion } from "motion/react"
import { useTranslation } from "react-i18next"

import { searchMenuItemAtom, selectedMenuItemIdAtom } from "@/atoms"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types"

interface FoodCardProps {
  item: MenuItem
}

export default function FoodCard({ item }: FoodCardProps) {
  const { t } = useTranslation("menu_section")

  const [selectedId, setSelectedId] = useAtom(selectedMenuItemIdAtom)
  const searchTerm = useAtomValue(searchMenuItemAtom)

  function handleToggleSelectItem() {
    if (selectedId === item.id) {
      setSelectedId("")
      return
    }
    setSelectedId(item.id)
  }

  function highlightSearchTerm(text: string, term: string) {
    if (!term) return text
    const regex = new RegExp(`(${term})`, "gi")
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-amber-500 text-black">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      key={item.id}
      layout
    >
      <div
        className={cn(
          "relative min-h-[80px] rounded-md border-2 border-solid p-1",
          Number(item.stock) <= 0 && "bg-red-200 text-red-500",
          selectedId === item.id && "bg-neutral-800 text-white",
        )}
        onClick={handleToggleSelectItem}
      >
        <p>{highlightSearchTerm(item.name, searchTerm)}</p>
        <div className="absolute right-0 bottom-0 flex w-full justify-between px-2">
          <p
            className={cn(
              Number(item.stock) <= 0 ? "text-red-500" : "text-neutral-400",
            )}
          >
            {t("stock")}: {item.stock}
          </p>
          <p className="text-neutral-400">€ {item.price}</p>
        </div>
      </div>
    </motion.div>
  )
}
