import { IconChevronLeft, IconHome } from "@tabler/icons-react"
import { useCanGoBack, useRouter } from "@tanstack/react-router"

import { AnimatedButton } from "@/components/ui/button"

export default function GoBackButton() {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  function handleGoBack() {
    if (canGoBack) {
      router.history.back()
    } else {
      router.navigate({ to: "/" })
    }
  }

  return (
    <div className="flex">
      <AnimatedButton variant="outline" onClick={handleGoBack}>
        {canGoBack ? <IconChevronLeft /> : <IconHome />}
      </AnimatedButton>
    </div>
  )
}
