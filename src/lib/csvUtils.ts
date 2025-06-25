import Papa from "papaparse"
import type { ParseResult } from "papaparse"

import type { OrderRecord, MenuItem, OrderItem } from "@/types"

// Download order records as CSV
export function downloadOrderRecordsAsCSV(orderRecords: OrderRecord[]) {
  const flatRecords = orderRecords.map((record) => ({
    ...record,
    items: JSON.stringify(record.items),
  }))
  const csv = Papa.unparse(flatRecords)
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
        const orderRecords: OrderRecord[] = data.map(
          (row: Record<string, string>) => {
            // Defensive: parse all required fields
            let items: OrderItem[] = []

            try {
              items = JSON.parse(row.items || "[]")
            } catch {
              items = []
            }

            return {
              id: row.id || "",
              items,
              total: Number(row.total ?? 0),
              created_at: row.created_at || "",
              recived_account: row.recived_account || "",
              is_refunded: row.is_refunded === "true",
            }
          },
        )

        setOrderRecords(orderRecords)

        // Populate menuListAtom and receivedAccountAtom from order records
        const menuItems: MenuItem[] = []
        const receivedAccounts: Set<string> = new Set()

        for (let i = 0; i < orderRecords.length; i++) {
          const record = orderRecords[i]

          if (record.total > 0) {
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
