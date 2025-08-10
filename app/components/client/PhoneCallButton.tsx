"use client"

import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"
import type { ComponentProps } from "react"

interface PhoneCallButtonProps extends ComponentProps<typeof Button> {
  showIcon?: boolean
  phoneNumber?: string
  children?: React.ReactNode
}

export function PhoneCallButton({ 
  showIcon = true,
  phoneNumber = SITE_CONFIG.phoneClean,
  children,
  variant = "default",
  size = "xl",
  className = "bg-secondary-700 text-white hover:bg-secondary-800 border-secondary-700",
  ...props
}: PhoneCallButtonProps) {
  const handleClick = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {showIcon && <Phone className="mr-2 h-5 w-5" />}
      {children || `Call ${SITE_CONFIG.phone}`}
    </Button>
  )
}