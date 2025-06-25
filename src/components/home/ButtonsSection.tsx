import {
  IconDownload,
  IconReceipt,
  IconRefresh,
  IconReport,
  IconUpload,
  IconUser,
} from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"
import { useAtomValue, useSetAtom } from "jotai"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import {
  menuListAtom,
  newOrderAtom,
  orderRecordsAtom,
  receivedAccountAtom,
} from "@/atoms"
import { AnimatedButton } from "@/components/ui/button"
import {
  downloadOrderRecordsAsCSV,
  uploadCSVAndPopulateAtoms,
} from "@/lib/csvUtils"

import CreateExpenseDialog from "./CreateExpenseDialog"
import ManageReceiveAccountDialog from "./ManageReceiveAccountDialog"
import PaymentConfirmDialog from "./PaymentConfirmDialog"
import ResetAllStateDialog from "./ResetAllStateDialog"

export default function ButtonsSection() {
  const { t } = useTranslation("home")
  const navigate = useNavigate()

  const [openResetDialog, setOpenResetDialog] = useState(false)
  const [openReceiveAccountDialog, setOpenReceiveAccountDialog] =
    useState(false)
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false)
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const currentOrder = useAtomValue(newOrderAtom)
  const orderRecords = useAtomValue(orderRecordsAtom)
  const setMenuList = useSetAtom(menuListAtom)
  const setReceivedAccounts = useSetAtom(receivedAccountAtom)
  const setOrderRecords = useSetAtom(orderRecordsAtom)

  function handleDownload() {
    if (orderRecords.length === 0) {
      toast.error(t("no_orders_to_download"))
      return
    }
    downloadOrderRecordsAsCSV(orderRecords)
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      uploadCSVAndPopulateAtoms(
        file,
        setMenuList,
        setReceivedAccounts,
        setOrderRecords,
      )
        .then(() => toast.success(t("upload_success_toast")))
        .catch((err) => {
          toast.error(t("upload_failed_toast"))
          console.error(err)
        })
    }
  }

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
        <AnimatedButton onClick={() => setOpenExpenseDialog(true)}>
          <IconReceipt />
          {t("add_expense_btn")}
        </AnimatedButton>
        <AnimatedButton onClick={handleDownload}>
          <IconDownload />
          {t("download_csv_btn")}
        </AnimatedButton>
        <label>
          <AnimatedButton onClick={() => inputRef.current?.click()}>
            <IconUpload />
            {t("upload_csv_btn")}
          </AnimatedButton>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </label>
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
      <CreateExpenseDialog
        open={openExpenseDialog}
        onOpenChange={setOpenExpenseDialog}
      />
    </>
  )
}
