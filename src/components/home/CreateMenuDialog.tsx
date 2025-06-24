import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"

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
import { MenuSchema, type MenuType } from "@/types"

interface CreateMenuDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: MenuType) => void
  selectedItem?: MenuType
}

const defaultValues = { name: "", price: "0" }

export default function CreateMenuDialog({
  open,
  onOpenChange,
  onSubmit,
  selectedItem,
}: CreateMenuDialogProps) {
  const { t } = useTranslation(["common", "menu_section"])

  const method = useForm<MenuType>({
    defaultValues,
    resolver: zodResolver(MenuSchema),
  })
  const { control, register, handleSubmit, reset } = method

  function handleFormSubmit() {
    handleSubmit(
      (values: MenuType) => {
        onSubmit(values)
      },
      (errors) => {
        console.log("Form errors:", errors)
      },
    )()
  }

  useEffect(() => {
    if (selectedItem) {
      reset(selectedItem)
    }
  }, [selectedItem])

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
            <DialogTitle>{t("create_menu_form_title")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="menu-name">{t("form_menu_name")}</Label>
              <Input {...register("name")} id="menu-name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="menu-price">{t("form_menu_price")}</Label>
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
