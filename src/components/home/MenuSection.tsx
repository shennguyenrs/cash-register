import {
  IconBackspace,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
import { useAtom, useAtomValue } from "jotai"

import { useState, type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import { v4 as uuid } from "uuid"

import {
  isPurchasedItemAtom,
  menuListAtom,
  searchMenuItemAtom,
  selectedMenuItemIdAtom,
} from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { MenuItem, MenuType } from "@/types"

import CreateMenuDialog from "./CreateMenuDialog"
import MenuList from "./MenuList"

const MAX_HEIGHT_ITEMS = 16

export default function MenuSection() {
  const { t } = useTranslation("menu_section")

  const [inputValue, setInputValue] = useState("")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [menu, setMenu] = useAtom(menuListAtom)
  const [selectedId, setSelectedId] = useAtom(selectedMenuItemIdAtom)
  const [searchTerm, setSearchTerm] = useAtom(searchMenuItemAtom)
  const isPurchasedItem = useAtomValue(isPurchasedItemAtom)

  function handleSubmit(values: MenuType) {
    // Handling editing item
    if (selectedId) {
      const newList = [...menu]
      const index = newList.findIndex((i) => i.id === selectedId)
      newList[index] = { ...values, id: selectedId }
      setMenu(newList)
    } else {
      // Handling adding new item
      const id = uuid()
      const newList = [...menu, { ...values, id }] as MenuItem[]
      setMenu(newList)
    }

    setOpenCreateDialog(false)
  }

  function handleRemoveMenuItem() {
    let newList = [...menu]
    newList = newList.filter((i) => i.id !== selectedId)
    setMenu(newList)
    setSelectedId("")
  }

  function handleOnSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
    const timer = setTimeout(() => {
      setSearchTerm(e.target.value)
    }, 500)
    return () => clearTimeout(timer)
  }

  function handleClearSearch() {
    setSearchTerm("")
    setInputValue("")
  }

  const filteredMenu = menu.filter((i) => i.name.includes(searchTerm))
  const selectedItem = menu.find((i) => i.id === selectedId) ?? undefined
  const isDeleteButtonDisabled = !selectedId || isPurchasedItem[selectedId]

  return (
    <div className="relative overflow-y-scroll rounded-md border-2 border-solid">
      <MenuList items={filteredMenu} />
      <div
        className={cn(
          "bg-opacity-0 bottom-0 flex w-full gap-2 rounded-tl-md rounded-tr-md bg-neutral-100 p-2 backdrop-blur-sm backdrop-filter",
          filteredMenu.length <= MAX_HEIGHT_ITEMS ? "absolute" : "sticky",
        )}
      >
        <Input
          type="text"
          placeholder={t("menu_section:search_menu_placeholder")}
          value={inputValue}
          onChange={handleOnSearchChange}
        />
        <AnimatedButton onClick={handleClearSearch} disabled={!inputValue}>
          <IconBackspace />
        </AnimatedButton>
        <AnimatedButton onClick={() => setOpenCreateDialog(true)}>
          {selectedId ? <IconPencil /> : <IconPlus />}
        </AnimatedButton>
        <AnimatedButton
          onClick={handleRemoveMenuItem}
          variant="destructive"
          disabled={isDeleteButtonDisabled}
        >
          <IconTrash />
        </AnimatedButton>
      </div>
      <CreateMenuDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={handleSubmit}
        selectedItem={selectedItem}
      />
    </div>
  )
}
