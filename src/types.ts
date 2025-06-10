import { z } from "zod"

export const MenuSchema = z.object({
  name: z.string(),
  price: z.string().refine((val) => isNaN(Number(val)) === false),
})

export type MenuType = z.infer<typeof MenuSchema>
export interface MenuItem extends MenuType {
  id: number
}
