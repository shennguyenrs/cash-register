import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import type { OrderItem, MenuItem, OrderRecord } from "@/types"

export const menuListAtom = atomWithStorage<MenuItem[]>("menu-list", [])
export const selectedMenuItemIdAtom = atom("")
export const searchMenuItemAtom = atom("")

export const numpadInputValueAtom = atom("0")

export const newOrderAtom = atom<OrderItem[]>([])
export const selectedOrderItemIdxAtom = atom(-1)
export const orderRecordsAtom = atomWithStorage<OrderRecord[]>(
  "order-records",
  [],
)

export const receivedAccountAtom = atomWithStorage<string[]>(
  "received-accounts",
  [],
)
export const lastUsedAccountIdxAtom = atom(-1)

export const purchasedItemsSummaryAtom = atom((get) => {
  const orderRecords = get(orderRecordsAtom)
  const summary: Record<string, number> = {}

  for (let i = 0; i < orderRecords.length; i++) {
    const record = orderRecords[i]

    if (record.total > 0 && !record.is_refunded) {
      for (let j = 0; j < record.items.length; j++) {
        const item = record.items[j]
        const itemId = item.id
        const quantity = Number(item.quantity)

        if (summary[itemId]) {
          summary[itemId] += quantity
        } else {
          summary[itemId] = quantity
        }
      }
    }
  }

  return summary
})

export const isPurchasedItemAtom = atom((get) => {
  const summary = get(purchasedItemsSummaryAtom)
  const isPurchased: Record<string, boolean> = {}

  const itemIds = Object.keys(summary)
  for (let i = 0; i < itemIds.length; i++) {
    const itemId = itemIds[i]
    isPurchased[itemId] = summary[itemId] > 0
  }

  return isPurchased
})

export const resetAllAtoms = atom(null, (_, set) => {
  set(menuListAtom, [])
  set(selectedMenuItemIdAtom, "")
  set(searchMenuItemAtom, "")
  set(numpadInputValueAtom, "0")
  set(newOrderAtom, [])
  set(selectedOrderItemIdxAtom, -1)
  set(orderRecordsAtom, [])
})
