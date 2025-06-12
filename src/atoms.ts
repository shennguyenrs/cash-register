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

export const receivedAccountAtom = atom<string[]>([])
export const lastUsedAccountIdxAtom = atom(-1)

export const resetAllAtoms = atom(null, (_, set) => {
  set(menuListAtom, [])
  set(selectedMenuItemIdAtom, "")
  set(searchMenuItemAtom, "")
  set(numpadInputValueAtom, "0")
  set(newOrderAtom, [])
  set(selectedOrderItemIdxAtom, -1)
  set(orderRecordsAtom, [])
})
