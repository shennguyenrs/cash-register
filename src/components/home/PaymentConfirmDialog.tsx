import { format } from "date-fns"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { v4 as uuid } from "uuid"

import {
  lastUsedAccountIdxAtom,
  newOrderAtom,
  orderRecordsAtom,
  receivedAccountAtom,
} from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrderRecord } from "@/types"

interface PaymentConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PaymentConfirmDialog({
  open,
  onOpenChange,
}: PaymentConfirmDialogProps) {
  const { t } = useTranslation(["home", "common"])
  const receiveAccount = useAtomValue(receivedAccountAtom)
  const [lastUsedAccountIdx, setLastUsedAccountIdx] = useAtom(
    lastUsedAccountIdxAtom,
  )
  const [newOrder, setNewOrder] = useAtom(newOrderAtom)
  const setOrderRecords = useSetAtom(orderRecordsAtom)
  const [selectedAccount, setSelectedAccount] = useState(receiveAccount[0])

  function handleConfirmPayment() {
    if (selectedAccount !== receiveAccount[lastUsedAccountIdx]) {
      setLastUsedAccountIdx(receiveAccount.indexOf(selectedAccount))
    }
    const total = newOrder.reduce(
      (sum, i) => sum + Number(i.price) * Number(i.quantity),
      0,
    )
    const timestamp = new Date()

    const order: OrderRecord = {
      id: uuid(),
      items: newOrder,
      total,
      created_at: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss"),
      recived_account: selectedAccount,
      is_refunded: false,
    }

    setOrderRecords((prev) => [order, ...prev])
    setNewOrder([])
    onOpenChange(false)
    toast.success(t("payment_success_toast"))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("payment_confirm_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t("payment_confirm_dialog_desc")}
          </DialogDescription>
        </DialogHeader>
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={t("payment_select_account_placeholder")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {receiveAccount.map((i, idx) => (
                <SelectItem key={idx} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <DialogClose asChild>
            <AnimatedButton variant="outline">
              {t("common:close_btn")}
            </AnimatedButton>
          </DialogClose>
          <AnimatedButton
            onClick={handleConfirmPayment}
            disabled={receiveAccount.length === 0 || selectedAccount === ""}
          >
            {t("common:confirm_btn")}
          </AnimatedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
