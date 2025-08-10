"use client"

// Enterprise-grade tree-shaking via Next.js modularizeImports
import { Shield, CheckCircle, Truck, Lock } from "lucide-react"
import { TRUST_BADGES } from "@/lib/constants"

const iconMap = {
  shield: Shield,
  check: CheckCircle,
  truck: Truck,
  lock: Lock,
}

function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-y border-gray-200">
      {TRUST_BADGES.map((badge, index) => {
        const Icon = iconMap[badge.icon as keyof typeof iconMap]
        return (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <Icon className="h-4 w-4 text-secondary-500" />
            <span className="font-medium">{badge.text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default TrustBadges