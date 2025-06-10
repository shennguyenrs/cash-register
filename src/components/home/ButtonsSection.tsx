import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  IconDownload,
  IconReceipt,
  IconRefresh,
  IconReport,
  IconUpload,
  IconUser,
} from "@tabler/icons-react"
import { AnimatedButton } from "@/components/ui/button"

import ResetAllStateDialog from "./ResetAllStateDialog"

export default function ButtonsSection() {
  const { t } = useTranslation()

  const [openResetDialog, setOpenResetDialog] = useState(false)

  return (
    <>
      <div className="col-span-2 flex flex-wrap gap-2">
        <AnimatedButton>
          <IconReport />
          {t("home.report_btn")}
        </AnimatedButton>
        <AnimatedButton>
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
          className="bg-red-400"
          onClick={() => setOpenResetDialog(true)}
        >
          <IconRefresh />
          {t("home.reset_btn")}
        </AnimatedButton>
      </div>
      <div className="col-span-1">
        <AnimatedButton className="w-full bg-emerald-400">
          {t("home.pay_btn")}
        </AnimatedButton>
      </div>
      <ResetAllStateDialog
        open={openResetDialog}
        onOpenChange={setOpenResetDialog}
      />
    </>
  )
}
