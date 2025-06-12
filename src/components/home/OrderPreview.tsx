import { IconTrash } from "@tabler/icons-react"
import { useAtom, useSetAtom } from "jotai"
import { AnimatePresence, motion } from "motion/react"
import { useTranslation } from "react-i18next"

import {
  newOrderAtom,
  numpadInputValueAtom,
  selectedMenuItemIdAtom,
  selectedOrderItemIdxAtom,
} from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MAX_HEIGHT_ITEMS = 25

export default function OrderPreview() {
  const { t } = useTranslation()
  const [orderItems, setOrderItems] = useAtom(newOrderAtom)
  const [selectedOrderItemIdx, setSelectedOrderItemIdx] = useAtom(
    selectedOrderItemIdxAtom,
  )
  const setSeletedMenuItemId = useSetAtom(selectedMenuItemIdAtom)
  const setNumpadInputValue = useSetAtom(numpadInputValueAtom)

  const total = orderItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity)
  }, 0)

  function resetSelected() {
    setSelectedOrderItemIdx(-1)
    setSeletedMenuItemId("")
    setNumpadInputValue("0")
  }

  function handleToggleOrderItem(idx: number) {
    if (idx === selectedOrderItemIdx) {
      resetSelected()
      return
    }

    setSeletedMenuItemId(orderItems[idx].id)
    setNumpadInputValue(String(orderItems[idx].quantity))
    setSelectedOrderItemIdx(idx)
  }

  function handleDeleteOrderItem() {
    const newList = [...orderItems].filter(
      (_, idx) => idx !== selectedOrderItemIdx,
    )
    setOrderItems(newList)
    resetSelected()
  }

  return (
    <div className="relative overflow-y-scroll rounded-md border-2 border-solid">
      <div className="py-2">
        <AnimatePresence>
          {orderItems.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={idx}
              layout
            >
              <div
                key={idx}
                className={cn(
                  "flex justify-between rounded-sm px-2 text-lg",
                  idx === selectedOrderItemIdx && "bg-amber-500",
                )}
                onClick={() => handleToggleOrderItem(idx)}
              >
                <p>{item.name}</p>
                <p>x {item.quantity}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div
        className={cn(
          "bg-opacity-0 bottom-0 w-full rounded-tl-md rounded-tr-md bg-neutral-100 px-2 py-4 backdrop-blur-sm backdrop-filter",
          orderItems.length <= MAX_HEIGHT_ITEMS ? "absolute" : "sticky",
        )}
      >
        {selectedOrderItemIdx !== -1 && (
          <AnimatedButton
            className="mb-2 w-full"
            variant="destructive"
            onClick={handleDeleteOrderItem}
          >
            <IconTrash />
          </AnimatedButton>
        )}
        <div className="flex justify-between text-xl font-bold">
          <p>{t("preview_order_section.total")}</p>
          <p>€ {total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
