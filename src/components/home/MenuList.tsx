import { useTranslation } from "react-i18next"

import type { MenuItem } from "@/types"

import FoodCard from "./FoodCard"

interface MenuListProps {
  items: MenuItem[]
}

export default function MenuList({ items }: MenuListProps) {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <div className="flex justify-center pt-2">
        <p className="text-neutral-500 italic">
          {t("menu_section.no_menu_available")}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {items.map((item) => (
        <FoodCard key={item.id} item={item} />
      ))}
    </div>
  )
}
