"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"
import dynamic from "next/dynamic"

// Simple lightweight lead form component
export function LeadFormWrapper() {
  const [showFullForm, setShowFullForm] = useState(false)
  
  const ProgressiveLeadForm = dynamic(
    () => import("@/components/forms/ProgressiveLeadForm"),
    { 
      loading: () => (
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-lg mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      ),
      ssr: false 
    }
  )

  if (showFullForm) {
    return <ProgressiveLeadForm />
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Connect with Certified DEA Specialists
        </h3>
        <p className="text-sm text-gray-600">Get compliant disposal quotes in 60 seconds</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
          <p className="text-gray-600 mb-4">
            ✓ DEA Registered Partners<br/>
            ✓ Form 41 Processing<br/>
            ✓ Same-Day Pickup Available
          </p>
          <Button
            variant="cta"
            size="lg"
            className="w-full text-sm sm:text-base"
            onClick={() => setShowFullForm(true)}
          >
            Get Free DEA Disposal Quote
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}


// Final CTA buttons
export function FinalCTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        variant="default"
        size="xl"
        className="bg-white text-primary-600 hover:bg-gray-100"
        onClick={() => {
          const element = document.getElementById('lead-form')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        Get Free Compliance Assessment
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      <Button
        variant="default"
        size="xl"
        className="bg-secondary-700 text-white hover:bg-secondary-800 border-secondary-700"
        onClick={() => window.location.href = `tel:${SITE_CONFIG.phoneClean}`}
      >
        <Phone className="mr-2 h-5 w-5" />
        Call {SITE_CONFIG.phone}
      </Button>
    </div>
  )
}

// Floating Mobile CTA
export function FloatingMobileCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40">
      <Button
        variant="cta"
        size="lg"
        className="w-full"
        onClick={() => {
          const element = document.getElementById('lead-form')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        Get DEA Disposal Quote
      </Button>
    </div>
  )
}

// Below fold sections with scroll functionality
export function BelowFoldSections() {
  const scrollToForm = () => {
    const element = document.getElementById('lead-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const ComparisonSection = dynamic(
    () => import("./sections/ComparisonSection"),
    { loading: () => <div className="py-16 bg-gray-50 animate-pulse"><div className="h-96"></div></div> }
  )

  const PricingSection = dynamic(
    () => import("./sections/PricingSection"),
    { loading: () => <div className="py-16 bg-gray-50 animate-pulse"><div className="h-96"></div></div> }
  )

  const IndustriesSection = dynamic(
    () => import("./sections/IndustriesSection"),
    { loading: () => <div className="py-16 bg-gray-50 animate-pulse"><div className="h-96"></div></div> }
  )

  const FAQSection = dynamic(
    () => import("./sections/FAQSection"),
    { loading: () => <div className="py-16 bg-gray-50 animate-pulse"><div className="h-96"></div></div> }
  )

  return (
    <>
      <ComparisonSection scrollToForm={scrollToForm} />
      <PricingSection scrollToForm={scrollToForm} />
      <IndustriesSection scrollToForm={scrollToForm} />
      <FAQSection />
    </>
  )
}