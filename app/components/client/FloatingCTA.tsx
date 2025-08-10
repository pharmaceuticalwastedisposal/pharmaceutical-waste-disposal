"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function FloatingCTA() {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 300)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!showFloatingCTA) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
      <div className="container mx-auto px-2 sm:px-4 py-3">
        <Button
          variant="cta"
          size="lg"
          className="w-full"
          onClick={() => {
            const element = document.getElementById('lead-form')
            if (element) {
              const headerHeight = 140 // Account for sticky header height
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
              const offsetPosition = elementPosition - headerHeight
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              })
            }
          }}
        >
          <span className="sm:hidden">Get Quote</span>
          <span className="hidden sm:inline">Get Free Compliance Check</span>
        </Button>
      </div>
    </div>
  )
}