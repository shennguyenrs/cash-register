import { useAtomValue } from "jotai"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { newOrderAtom } from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import {
  IconDownload,
  IconReceipt,
  IconRefresh,
  IconReport,
  IconUpload,
  IconUser,
} from "@tabler/icons-react"

import ManageReceiveAccountDialog from "./ManageReceiveAccountDialog"
import PaymentConfirmDialog from "./PaymentConfirmDialog"
import ResetAllStateDialog from "./ResetAllStateDialog"

export default function ButtonsSection() {
  const { t } = useTranslation()
  const currentOrder = useAtomValue(newOrderAtom)

  const [openResetDialog, setOpenResetDialog] = useState(false)
  const [openReceiveAccountDialog, setOpenReceiveAccountDialog] =
    useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)

  return (
    <>
      <div className="col-span-2 flex flex-wrap gap-2">
        <AnimatedButton>
          <IconReport />
          {t("home.report_btn")}
        </AnimatedButton>
        <AnimatedButton onClick={() => setOpenReceiveAccountDialog(true)}>
          <IconUser />
          {t("home.manage_receive_account_btn")}
        </AnimatedButton>
        <AnimatedButton>
          <IconReceipt />
          {t("home.add_expense_btn")}
        </AnimatedButton>
        <AnimatedButton>
          <IconDownload />
          {t("home.download_csv_btn")}
        </AnimatedButton>
        <AnimatedButton>
          <IconUpload />
          {t("home.upload_csv_btn")}
        </AnimatedButton>
        <AnimatedButton
          onClick={() => setOpenResetDialog(true)}
          variant="destructive"
        >
          <IconRefresh />
          {t("home.reset_btn")}
        </AnimatedButton>
      </div>
      <div className="col-span-1">
        <AnimatedButton
          className="w-full bg-emerald-400"
          onClick={() => setOpenPaymentDialog(true)}
          disabled={currentOrder.length === 0}
        >
          {t("home.pay_btn")}
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
