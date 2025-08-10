"use client"

import { useState, useEffect } from "react"
import { TrendingDown, MapPin } from "lucide-react"
import { SOCIAL_PROOF } from "@/lib/constants"

function SocialProofTicker() {
  const [currentProof, setCurrentProof] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentProof((prev) => (prev + 1) % SOCIAL_PROOF.length)
        setIsVisible(true)
      }, 300)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const proof = SOCIAL_PROOF[currentProof]

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div
        className={`bg-white rounded-lg shadow-xl border border-gray-200 p-4 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="bg-secondary-100 rounded-full p-2">
            <TrendingDown className="h-4 w-4 text-secondary-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {proof.facility}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {proof.location}
            </p>
            <p className="text-sm font-bold text-secondary-600 mt-1">
              Saved {proof.savings}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialProofTicker