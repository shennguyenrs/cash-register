import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai"

import type { MenuItem } from "@/types"

export const menuListAtom = atomWithStorage<MenuItem[]>("menu-list", [])
export const selectedMenuItemIdxAtom = atom(0)
export const searchMenuItemAtom = atom("")

export const resetAllAtoms = atom(null, (_, set) => {
  set(menuListAtom, [])
  set(selectedMenuItemIdxAtom, 0)
})
