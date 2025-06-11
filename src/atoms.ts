import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import type { OrderItem, MenuItem, OrderRecord } from "@/types"

export const menuListAtom = atomWithStorage<MenuItem[]>("menu-list", [])
export const selectedMenuItemIdAtom = atom(0)
export const searchMenuItemAtom = atom("")

export const newOrderAtom = atom<OrderItem[]>([])
export const orderRecordsAtom = atomWithStorage<OrderRecord[]>(
  "order-records",
  [],
)

export const resetAllAtoms = atom(null, (_, set) => {
  set(menuListAtom, [])
  set(selectedMenuItemIdAtom, 0)
})
