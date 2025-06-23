import { useSetAtom } from "jotai"
import { useTranslation } from "react-i18next"

import { resetAllAtoms } from "@/atoms"
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

interface ResetAllStateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ResetAllStatesDaialog({
  open,
  onOpenChange,
}: ResetAllStateDialogProps) {
  const { t } = useTranslation(["home", "common"])

  const setResetAllstate = useSetAtom(resetAllAtoms)

  function handleConfirm() {
    setResetAllstate()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("reset_all_state_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t("reset_all_state_dialog_desc")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <AnimatedButton variant="outline">{t("cancel_btn")}</AnimatedButton>
          </DialogClose>
          <AnimatedButton onClick={handleConfirm}>
            {t("confirm_btn")}
          </AnimatedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
