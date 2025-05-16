"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type SubstanceLogContextType = {
  openSubstanceLogDialog: () => void
  isSubstanceLogDialogOpen: boolean
  setIsSubstanceLogDialogOpen: (isOpen: boolean) => void
}

const SubstanceLogContext = createContext<SubstanceLogContextType | undefined>(undefined)

export function SubstanceLogProvider({ children }: { children: React.ReactNode }) {
  const [isSubstanceLogDialogOpen, setIsSubstanceLogDialogOpen] = useState(false)

  const openSubstanceLogDialog = () => {
    setIsSubstanceLogDialogOpen(true)
  }

  // Listen for custom events to open the dialog
  useEffect(() => {
    const handleOpenLogDialog = () => {
      setIsSubstanceLogDialogOpen(true)
    }

    window.addEventListener("open-substance-log-dialog", handleOpenLogDialog)
    return () => {
      window.removeEventListener("open-substance-log-dialog", handleOpenLogDialog)
    }
  }, [])

  return (
    <SubstanceLogContext.Provider
      value={{
        openSubstanceLogDialog,
        isSubstanceLogDialogOpen,
        setIsSubstanceLogDialogOpen,
      }}
    >
      {children}
    </SubstanceLogContext.Provider>
  )
}

export function useSubstanceLog() {
  const context = useContext(SubstanceLogContext)
  if (context === undefined) {
    throw new Error("useSubstanceLog must be used within a SubstanceLogProvider")
  }
  return context
}
