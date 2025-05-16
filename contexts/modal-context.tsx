"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type ModalType = "substance" | "intervention" | null

interface ModalContextType {
  modalType: ModalType
  open: (type: "substance" | "intervention") => void
  close: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null)

  const open = (type: "substance" | "intervention") => {
    setModalType(type)
  }

  const close = () => {
    setModalType(null)
  }

  return <ModalContext.Provider value={{ modalType, open, close }}>{children}</ModalContext.Provider>
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}
