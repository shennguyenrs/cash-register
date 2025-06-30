import type { ParseResult } from "papaparse"
import Papa from "papaparse"

import {
  type MenuItem,
  type OrderItem,
  type OrderRecord,
  TRANSACTION_TYPE,
} from "@/types"
import { isTransactionType } from "./utils"

// Download order records as CSV
export function downloadOrderRecordsAsCSV(orderRecords: OrderRecord[]) {
  const recordsToExport = orderRecords.flatMap((record) => {
    if (record.items.length === 0) {
      return [
        {
          order_id: record.id,
          order_total: record.total,
          order_created_at: record.created_at,
          order_recived_account: record.recived_account,
          order_is_refunded: record.is_refunded,
          item_id: "",
          item_name: "",
          item_price: "",
          item_quantity: "",
        },
      ]
    }
    return record.items.map((item) => ({
      order_id: record.id,
      order_total: record.total,
      order_created_at: record.created_at,
      order_recived_account: record.recived_account,
      order_is_refunded: record.is_refunded,
      item_id: item.id,
      item_name: item.name,
      item_price: item.price,
      item_quantity: item.quantity,
    }))
  })

  const csv = Papa.unparse(recordsToExport)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "order-records.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Upload CSV and populate atoms
export function uploadCSVAndPopulateAtoms(
  file: File,
  setMenuList: (items: MenuItem[]) => void,
  setReceivedAccounts: (accounts: string[]) => void,
  setOrderRecords: (records: OrderRecord[]) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Record<string, string>>) => {
        const data = results.data
        const orderRecordsMap = new Map<string, OrderRecord>()

        for (const row of data) {
          const orderId = row.order_id
          if (!orderId) continue

          const item: OrderItem = {
            id: row.item_id,
            name: row.item_name,
            price: row.item_price,
            quantity: row.item_quantity,
          }

          if (orderRecordsMap.has(orderId)) {
            const existingRecord = orderRecordsMap.get(orderId)!
            if (item.id) {
              existingRecord.items.push(item)
            }
          } else {
            const newRecord: OrderRecord = {
              id: orderId,
              items: [],
              total: Number(row.order_total ?? 0),
              created_at: row.order_created_at || "",
              recived_account: row.order_recived_account || "",
              is_refunded: row.order_is_refunded === "true",
            }
            if (item.id) {
              newRecord.items.push(item)
            }
            orderRecordsMap.set(orderId, newRecord)
          }
        }

        const orderRecords = Array.from(orderRecordsMap.values())
        setOrderRecords(orderRecords)

        // Populate menuListAtom and receivedAccountAtom from order records
        const menuItems: MenuItem[] = []
        const receivedAccounts: Set<string> = new Set()

        for (let i = 0; i < orderRecords.length; i++) {
          const record = orderRecords[i]

          // Only add items from sales to the menu list (not from refunds or expenses)
          if (isTransactionType(record, TRANSACTION_TYPE.SALE)) {
            for (let j = 0; j < record.items.length; j++) {
              const item = record.items[j]
              if (!menuItems.find((m) => m.id === item.id)) {
                menuItems.push({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                })
              }
            }
          }

          if (record.recived_account) {
            receivedAccounts.add(record.recived_account)
          }
        }

        setMenuList(menuItems)
        setReceivedAccounts(Array.from(receivedAccounts))
        resolve()
      },
      error: (err: Error) => reject(err),
    })
  })
}
