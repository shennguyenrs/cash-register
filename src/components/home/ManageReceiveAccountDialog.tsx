import { IconPlus } from "@tabler/icons-react"
import { useAtom } from "jotai"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { receivedAccountAtom } from "@/atoms"
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

interface ManageReceiveAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ManageReceiveAccountDialog({
  open,
  onOpenChange,
}: ManageReceiveAccountDialogProps) {
  const { t } = useTranslation(["home", "common"])
  const [receiveAccount, setReceiveAccount] = useAtom(receivedAccountAtom)
  const [input, setInput] = useState("")

  function handleAddNewAccount() {
    setReceiveAccount([...receiveAccount, input])
    setInput("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("manage_receive_account_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t("manage_receive_account_dialog_desc")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {receiveAccount.map((i, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                layout
              >
                <p>{i}</p>
              </motion.p>
            ))}
          </AnimatePresence>
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <AnimatedButton onClick={handleAddNewAccount} disabled={!input}>
              <IconPlus />
            </AnimatedButton>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <AnimatedButton variant="outline">{t("close_btn")}</AnimatedButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
