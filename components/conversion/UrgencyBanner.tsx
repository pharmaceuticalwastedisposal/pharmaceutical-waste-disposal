"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { COMPLIANCE_ALERTS } from "@/lib/constants"

function UrgencyBanner() {
  const [currentAlert, setCurrentAlert] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % COMPLIANCE_ALERTS.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-warning/10 border-b border-warning/20">
      <div className="container mx-auto px-2 sm:px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
          <span className="font-medium text-gray-800">
            {COMPLIANCE_ALERTS[currentAlert]}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UrgencyBanner