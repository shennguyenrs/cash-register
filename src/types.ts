import { z } from "zod"

export const MenuSchema = z.object({
  name: z.string(),
  price: z.string().refine((val) => isNaN(Number(val)) === false),
  stock: z
    .string()
    .refine((val) => isNaN(Number(val)) === false && Number(val) >= 0),
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
  is_refunded: boolean
}

export const TRANSACTION_TYPE = {
  EXPENSE: "EXPENSE",
  REFUND: "REFUND",
  SALE: "SALE",
} as const

export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]
