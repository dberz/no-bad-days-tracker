"use client"

import { useEffect, useState } from "react"

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)
  const [showSubstanceModal, setShowSubstanceModal] = useState(false)
  const [showInterventionModal, setShowInterventionModal] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Event listeners for opening modals
    const handleOpenSubstanceModal = () => setShowSubstanceModal(true)
    const handleOpenInterventionModal = () => setShowInterventionModal(true)

    window.addEventListener("open-substance-log-modal", handleOpenSubstanceModal)
    window.addEventListener("open-intervention-log-modal", handleOpenInterventionModal)

    return () => {
      window.removeEventListener("open-substance-log-modal", handleOpenSubstanceModal)
      window.removeEventListener("open-intervention-log-modal", handleOpenInterventionModal)
    }
  }, [])

  if (!isMounted) return null

  return (
    <>
      {showSubstanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Log Substance Usage</h2>
            <p className="text-gray-600 mb-4">Track your substance use to better understand your patterns.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Substance</label>
                <select className="w-full p-2 border rounded">
                  <option>Select substance</option>
                  <option>Alcohol</option>
                  <option>Cannabis</option>
                  <option>MDMA</option>
                  <option>Ketamine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="text" placeholder="e.g. 2 drinks" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  placeholder="Any additional details..."
                  className="w-full p-2 border rounded"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSubstanceModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Substance logged!")
                    setShowSubstanceModal(false)
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInterventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Log Intervention</h2>
            <p className="text-gray-600 mb-4">Track your wellness activities to improve your harm score.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select className="w-full p-2 border rounded">
                  <option>Select type</option>
                  <option>Exercise</option>
                  <option>Meditation</option>
                  <option>Sleep</option>
                  <option>Nutrition</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input type="text" placeholder="e.g. 30 minutes" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  placeholder="Any additional details..."
                  className="w-full p-2 border rounded"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowInterventionModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Intervention logged!")
                    setShowInterventionModal(false)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
