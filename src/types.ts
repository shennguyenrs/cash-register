import { z } from "zod"

export const MenuSchema = z.object({
  name: z.string(),
  price: z.string().refine((val) => isNaN(Number(val)) === false),
})

export type MenuType = z.infer<typeof MenuSchema>

export interface MenuItem extends MenuType {
  id: number
}

export interface OrderItem extends MenuItem {
  quantity: string
}

export interface OrderRecord {
  id: string
  items: OrderItem[]
  total: number
  created_at: string
  recived_account: string
}
