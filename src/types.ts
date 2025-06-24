import { z } from "zod"

export const MenuSchema = z.object({
  name: z.string(),
  price: z.string().refine((val) => isNaN(Number(val)) === false),
})

export const ExpenseSchema = z.object({
  name: z.string(),
  price: z.string().refine((val) => isNaN(Number(val)) === false),
  received_account: z.string().refine((val) => Boolean(val)),
})

export type MenuType = z.infer<typeof MenuSchema>

export type ExpenseType = z.infer<typeof ExpenseSchema>

export interface MenuItem extends MenuType {
  id: string
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
