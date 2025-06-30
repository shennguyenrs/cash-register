import { clsx, type ClassValue } from "clsx"
import { parse } from "date-fns"
import { twMerge } from "tailwind-merge"

import {
  TRANSACTION_TYPE,
  type OrderRecord,
  type TransactionType,
} from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCreatedAt(dateStr: string) {
  if (dateStr.includes("T")) {
    return parse(dateStr, "yyyy-MM-dd'T'HH:mm:ss", new Date())
  } else {
    return parse(dateStr, "yyyy-MM-dd HH:mm:ss", new Date())
  }
}

export function isTransactionType(
  record: OrderRecord,
  type: TransactionType,
): boolean {
  const hasRefundItem = record.items.some((item) =>
    item.name.startsWith(`${TRANSACTION_TYPE.REFUND} `),
  )

  const hasExpenseItem = record.items.some((item) =>
    item.name.startsWith(`${TRANSACTION_TYPE.EXPENSE} `),
  )

  switch (type) {
    case TRANSACTION_TYPE.REFUND:
      return hasRefundItem
    case TRANSACTION_TYPE.EXPENSE:
      return hasExpenseItem
    case TRANSACTION_TYPE.SALE:
      return !hasRefundItem && !hasExpenseItem
    default:
      return false
  }
}

export function createTransactionName(
  type: TransactionType,
  name: string,
): string {
  if (type === TRANSACTION_TYPE.SALE) {
    return name // Sales don't need a prefix
  }
  return `${type} ${name}`
}

export function extractOriginalIdentifier(
  transactionName: string,
  type: TransactionType,
): string {
  if (type === TRANSACTION_TYPE.SALE) {
    return transactionName
  }

  const prefix = `${type} `
  if (transactionName.startsWith(prefix)) {
    return transactionName.substring(prefix.length)
  }

  return transactionName
}
