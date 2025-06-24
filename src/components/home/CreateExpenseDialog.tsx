import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"
import { v4 as uuid } from "uuid"

import { orderRecordsAtom, receivedAccountAtom } from "@/atoms"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExpenseSchema, type ExpenseType, type OrderRecord } from "@/types"

interface CreateExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultValues = { name: "", price: "0", received_account: "" }

export default function CreateExpenseDialog({
  open,
  onOpenChange,
}: CreateExpenseDialogProps) {
  const { t } = useTranslation(["home", "common", "menu_section"])

  const setOrderRecords = useSetAtom(orderRecordsAtom)
  const receiveAccount = useAtomValue(receivedAccountAtom)

  const method = useForm<ExpenseType>({
    defaultValues,
    resolver: zodResolver(ExpenseSchema),
  })
  const { control, register, handleSubmit, reset } = method

  function handleFormSubmit() {
    handleSubmit(
      (values: ExpenseType) => {
        const timestamp = new Date()

        const order: OrderRecord = {
          id: uuid(),
          items: [
            {
              id: uuid(),
              name: values.name,
              quantity: "-1",
              price: values.price,
            },
          ],
          total: Number(values.price) * -1,
          created_at: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss"),
          recived_account: values.received_account,
        }

        setOrderRecords((prev) => [order, ...prev])
        onOpenChange(false)
      },
      (errors) => {
        console.log("Form errors:", errors)
      },
    )()
  }

  useEffect(() => {
    if (!open) {
      reset(defaultValues)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleFormSubmit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("create_expense_form_title")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="expense-name">{t("form_expense_name")}</Label>
              <Input {...register("name")} id="expense-name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="expense-price">{t("form_expense_price")}</Label>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, name, value } }) => (
                  <NumericFormat
                    name={name}
                    value={value}
                    onChange={onChange}
                    customInput={Input}
                    decimalScale={2}
                  />
                )}
              />
            </div>
            <Label htmlFor="expense-receive-account">
              {t("form_expense_receive_account")}
            </Label>
            <Controller
              control={control}
              name="received_account"
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
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
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <AnimatedButton variant="outline">
                {t("cancel_btn")}
              </AnimatedButton>
            </DialogClose>
            <AnimatedButton onClick={handleFormSubmit}>
              {t("create_btn")}
            </AnimatedButton>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
