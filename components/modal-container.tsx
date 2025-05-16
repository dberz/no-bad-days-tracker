"use client"

import { useModal } from "@/contexts/modal-context"
import { SubstanceModal } from "@/components/substance-modal"
import { InterventionModal } from "@/components/intervention-modal"

export function ModalContainer() {
  const { modalType, close } = useModal()

  return (
    <>
      {modalType === "substance" && <SubstanceModal isOpen onClose={close} />}
      {modalType === "intervention" && <InterventionModal isOpen onClose={close} />}
    </>
  )
}
