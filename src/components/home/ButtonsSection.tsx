import {
  IconDownload,
  IconReceipt,
  IconRefresh,
  IconReport,
  IconUpload,
  IconUser,
} from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { newOrderAtom } from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"

import ManageReceiveAccountDialog from "./ManageReceiveAccountDialog"
import PaymentConfirmDialog from "./PaymentConfirmDialog"
import ResetAllStateDialog from "./ResetAllStateDialog"

export default function ButtonsSection() {
  const { t } = useTranslation("home")
  const currentOrder = useAtomValue(newOrderAtom)
  const navigate = useNavigate()

  const [openResetDialog, setOpenResetDialog] = useState(false)
  const [openReceiveAccountDialog, setOpenReceiveAccountDialog] =
    useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)

  return (
    <>
      <div className="col-span-2 flex flex-wrap gap-2">
        <AnimatedButton onClick={() => navigate({ to: "/report" })}>
          <IconReport />
          {t("report_btn")}
        </AnimatedButton>
        <AnimatedButton onClick={() => setOpenReceiveAccountDialog(true)}>
          <IconUser />
          {t("manage_receive_account_btn")}
        </AnimatedButton>
        <AnimatedButton>
          <IconReceipt />
          {t("add_expense_btn")}
        </AnimatedButton>
        <AnimatedButton>
          <IconDownload />
          {t("download_csv_btn")}
        </AnimatedButton>
        <AnimatedButton>
          <IconUpload />
          {t("upload_csv_btn")}
        </AnimatedButton>
        <AnimatedButton
          onClick={() => setOpenResetDialog(true)}
          variant="destructive"
        >
          <IconRefresh />
          {t("reset_btn")}
        </AnimatedButton>
      </div>
      <div className="col-span-1">
        <AnimatedButton
          className="w-full bg-emerald-400"
          onClick={() => setOpenPaymentDialog(true)}
          disabled={currentOrder.length === 0}
        >
          {t("pay_btn")}
        </AnimatedButton>
      </div>
      <ResetAllStateDialog
        open={openResetDialog}
        onOpenChange={setOpenResetDialog}
      />
      <ManageReceiveAccountDialog
        open={openReceiveAccountDialog}
        onOpenChange={setOpenReceiveAccountDialog}
      />
      <PaymentConfirmDialog
        open={openPaymentDialog}
        onOpenChange={setOpenPaymentDialog}
      />
    </>
  )
}
