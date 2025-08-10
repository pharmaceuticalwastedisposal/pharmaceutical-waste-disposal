"use client"

import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"

interface ScrollToFormButtonProps extends ComponentProps<typeof Button> {
  children: React.ReactNode
  targetId?: string
}

export function ScrollToFormButton({ 
  children, 
  targetId = 'lead-form',
  variant,
  size,
  className,
  ...props 
}: ScrollToFormButtonProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId)
    if (element) {
      const headerHeight = 140 // Account for sticky header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  )
}