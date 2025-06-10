import { IconBackspace, IconPlus, IconTrash } from "@tabler/icons-react"
import { useAtom } from "jotai"
import { useState, type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence } from "motion/react"

import { menuListAtom, searchMenuItemAtom, selectedMenuItemIdxAtom } from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { MenuItem, MenuType } from "@/types"

import CreateMenuDialog from "./CreateMenuDialog"
import MenuList from "./MenuList"

const MAX_HEIGHT_ITEMS = 16

export default function MenuSection() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [menu, setMenu] = useAtom(menuListAtom)
  const [selectedIdx, setSelectedIdx] = useAtom(selectedMenuItemIdxAtom)
  const [searchTerm, setSearchTerm] = useAtom(searchMenuItemAtom)

  function handleSubmit(values: MenuType) {
    const newId = menu.length + 1
    const newList = [...menu, { ...values, id: newId }] as MenuItem[]
    setMenu(newList)
    setOpenCreateDialog(false)
  }

  function handleRemoveMenuItem() {
    let newList = [...menu]
    newList = newList.filter((i) => i.id !== selectedIdx)
    setMenu(newList)
    setSelectedIdx(0)
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

  return (
    <div className="relative overflow-y-scroll rounded-md border-2 border-solid">
      <AnimatePresence>
        <MenuList items={filteredMenu} />
      </AnimatePresence>
      <div
        className={cn(
          "bg-opacity-0 bottom-0 flex w-full gap-2 rounded-tl-md rounded-tr-md bg-neutral-100 p-2 backdrop-blur-sm backdrop-filter",
          filteredMenu.length <= MAX_HEIGHT_ITEMS ? "absolute" : "sticky",
        )}
      >
        <Input
          type="text"
          placeholder={t("menu_section.search_menu_placeholder")}
          value={inputValue}
          onChange={handleOnSearchChange}
        />
        <AnimatedButton onClick={handleClearSearch} disabled={!inputValue}>
          <IconBackspace />
        </AnimatedButton>
        <AnimatedButton onClick={() => setOpenCreateDialog(true)}>
          <IconPlus />
        </AnimatedButton>
        <AnimatedButton
          onClick={handleRemoveMenuItem}
          className="bg-red-400"
          disabled={selectedIdx === 0}
        >
          <IconTrash />
        </AnimatedButton>
      </div>
      <CreateMenuDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
