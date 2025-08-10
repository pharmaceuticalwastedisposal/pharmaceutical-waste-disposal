"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, Menu, X, Shield, Clock } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const megaMenuData = {
    services: {
      title: "Services",
      columns: [
        {
          title: "Disposal Services",
          items: [
            { name: "Controlled Substance Disposal", href: "/services/controlled-substance-disposal" },
            { name: "Pharmaceutical Waste Disposal", href: "/services/pharmaceutical-waste-disposal" },
            { name: "Hazardous Drug Waste", href: "/services/hazardous-drug-waste" },
            { name: "Chemotherapy Waste", href: "/services/chemotherapy-waste" },
            { name: "Sharps Container Disposal", href: "/services/sharps-container-disposal" },
            { name: "Expired Medication Disposal", href: "/services/expired-medication-disposal" }
          ]
        },
        {
          title: "Specialty Services",
          items: [
            { name: "Medical Waste Disposal", href: "/services/medical-waste-disposal" },
            { name: "HIPAA Compliant Destruction", href: "/services/hipaa-compliant-destruction" },
            { name: "Reverse Distribution", href: "/services/reverse-distribution" },
            { name: "Emergency Pickup", href: "/services/emergency-pickup" },
            { name: "Container Supply", href: "/services/container-supply" },
            { name: "Compliance Consulting", href: "/services/compliance-consulting" }
          ]
        }
      ]
    },
    locations: {
      title: "Locations",
      columns: [
        {
          title: "Major States",
          items: [
            { name: "California", href: "/pharmaceutical-waste-disposal-california" },
            { name: "Texas", href: "/pharmaceutical-waste-disposal-texas" },
            { name: "Florida", href: "/pharmaceutical-waste-disposal-florida" },
            { name: "New York", href: "/pharmaceutical-waste-disposal-new-york" },
            { name: "Illinois", href: "/pharmaceutical-waste-disposal-illinois" },
            { name: "Pennsylvania", href: "/pharmaceutical-waste-disposal-pennsylvania" }
          ]
        },
        {
          title: "Major Cities",
          items: [
            { name: "Los Angeles, CA", href: "/pharmaceutical-waste-disposal-los-angeles" },
            { name: "Houston, TX", href: "/pharmaceutical-waste-disposal-houston" },
            { name: "Chicago, IL", href: "/pharmaceutical-waste-disposal-chicago" },
            { name: "Phoenix, AZ", href: "/pharmaceutical-waste-disposal-phoenix" },
            { name: "Miami, FL", href: "/pharmaceutical-waste-disposal-miami" },
            { name: "View All Locations →", href: "/locations", featured: true }
          ]
        }
      ]
    },
    whoWeServe: {
      title: "Who We Serve",
      columns: [
        {
          title: "Healthcare Facilities",
          items: [
            { name: "Hospitals", href: "/who-we-serve/hospitals" },
            { name: "Retail Pharmacies", href: "/who-we-serve/retail-pharmacies" },
            { name: "Long-Term Care Facilities", href: "/who-we-serve/long-term-care" },
            { name: "Medical Clinics", href: "/who-we-serve/medical-clinics" },
            { name: "Urgent Care Centers", href: "/who-we-serve/urgent-care" },
            { name: "Surgery Centers", href: "/who-we-serve/surgery-centers" }
          ]
        },
        {
          title: "Specialized Facilities",
          items: [
            { name: "Veterinary Practices", href: "/who-we-serve/veterinary" },
            { name: "Research Facilities", href: "/who-we-serve/research-facilities" },
            { name: "Nursing Homes", href: "/who-we-serve/nursing-homes" },
            { name: "Assisted Living", href: "/who-we-serve/assisted-living" },
            { name: "Home Healthcare", href: "/who-we-serve/home-healthcare" },
            { name: "Pharmaceutical Companies", href: "/who-we-serve/pharmaceutical-companies" }
          ]
        }
      ]
    },
    pricing: {
      title: "Pricing",
      columns: [
        {
          title: "Get Pricing",
          items: [
            { name: "Instant Quote Calculator", href: "/pricing/calculator" },
            { name: "Service Pricing Guide", href: "/pricing/guide" },
            { name: "Compare Our Rates", href: "/pricing/compare" },
            { name: "Volume Discounts", href: "/pricing/volume-discounts" },
            { name: "Contract Options", href: "/pricing/contracts" },
            { name: "Get Custom Quote →", href: "/quote", featured: true }
          ]
        },
        {
          title: "vs Competitors",
          items: [
            { name: "Stericycle Alternative", href: "/stericycle-alternative" },
            { name: "Waste Management Alternative", href: "/waste-management-alternative" },
            { name: "Daniels Health Alternative", href: "/daniels-health-alternative" },
            { name: "US Ecology Alternative", href: "/us-ecology-alternative" },
            { name: "Clean Harbors Alternative", href: "/clean-harbors-alternative" },
            { name: "Cost Comparison Tool", href: "/pricing/comparison-tool" }
          ]
        }
      ]
    },
    resources: {
      title: "Resources",
      columns: [
        {
          title: "Compliance & Regulatory",
          items: [
            { name: "Regulatory Compliance Guide", href: "/resources/regulatory-compliance-guide" },
            { name: "Federal Regulations", href: "/resources/federal-regulations" },
            { name: "Drug Control Requirements", href: "/resources/drug-control" },
            { name: "State Requirements", href: "/resources/state-requirements" },
            { name: "DOT Transportation Rules", href: "/resources/dot-transportation" },
            { name: "HIPAA Requirements", href: "/resources/hipaa" },
            { name: "Joint Commission Standards", href: "/resources/joint-commission" },
            { name: "Schedule Consultation →", href: "/resources/consultation", featured: true }
          ]
        },
        {
          title: "Tools & Support",
          items: [
            { name: "Cost Calculator", href: "/resources/cost-calculator" },
            { name: "Waste Classification Tool", href: "/resources/waste-classification" },
            { name: "Container Sizing Guide", href: "/resources/container-sizing" },
            { name: "Compliance Audit", href: "/resources/audit" },
            { name: "Documentation Support", href: "/resources/documentation" },
            { name: "Training Programs", href: "/resources/training" },
            { name: "Emergency Response", href: "/resources/emergency-response" },
            { name: "Best Practices", href: "/resources/best-practices" }
          ]
        }
      ]
    }
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 w-full">
      {/* Top bar with trust signals - MOBILE OPTIMIZED */}
      <div className="bg-primary-600 text-white py-2 sm:py-2 w-full overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-0">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium">Licensed & Certified</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium">15-Min Response</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4">
              <span className="hidden lg:inline text-xs">📧 compliance@pharmaceuticalwastedisposal.com</span>
              <span className="hidden lg:inline">|</span>
              <a 
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="font-bold text-sm hover:text-primary-200 transition-colors"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation - MOBILE OPTIMIZED */}
      <nav className="bg-white border-b border-gray-200 w-full">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - MOBILE FRIENDLY */}
            <Link href="/" className="flex-shrink-0 mr-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-primary-600 rounded-lg p-1.5 sm:p-2">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-xl text-gray-900 leading-tight">
                    PharmaceuticalWasteDisposal.com
                  </div>
                  <div className="text-xs text-gray-600 hidden sm:block">Licensed • Certified • Compliant</div>
                </div>
              </div>
            </Link>

            {/* Desktop Mega Menu Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {Object.entries(megaMenuData).map(([key, section]) => (
                <div
                  key={key}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                    {section.title}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Mega Menu Dropdown */}
                  {activeDropdown === key && (
                    <div className="absolute left-0 mt-0 w-[600px] bg-white rounded-md shadow-2xl border border-gray-200 z-50">
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-8">
                          {section.columns.map((column, index) => (
                            <div key={index}>
                              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                                {column.title}
                              </h3>
                              <ul className="space-y-2">
                                {column.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={item.href}
                                      className={`block text-sm transition-colors ${
                                        (item as any).featured
                                          ? "text-primary-600 font-semibold hover:text-primary-700"
                                          : "text-gray-600 hover:text-gray-900"
                                      }`}
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `tel:${SITE_CONFIG.phoneClean}`}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              <Button
                variant="cta"
                size="sm"
                onClick={() => {
                  const form = document.getElementById('lead-form')
                  if (form) {
                    const headerHeight = 140 // Account for sticky header height
                    const elementPosition = form.getBoundingClientRect().top + window.pageYOffset
                    const offsetPosition = elementPosition - headerHeight
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    })
                  } else {
                    window.location.href = '/#lead-form'
                  }
                }}
              >
                Free Quote
              </Button>
            </div>

            {/* Mobile menu button - OPTIMIZED TOUCH TARGET */}
            <button
              className="lg:hidden p-3 -mr-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 max-h-screen overflow-y-auto">
            <div className="container mx-auto px-2 sm:px-4 py-4">
              {Object.entries(megaMenuData).map(([key, section]) => (
                <div key={key} className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    {section.title}
                  </h3>
                  <div className="space-y-4">
                    {section.columns.map((column, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
                          {column.title}
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {column.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                href={item.href}
                                className={`block text-sm py-1 pl-4 transition-colors ${
                                  (item as any).featured
                                    ? "text-primary-600 font-semibold"
                                    : "text-gray-600 hover:text-primary-600"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = `tel:${SITE_CONFIG.phoneClean}`
                    setIsMenuOpen(false)
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call {SITE_CONFIG.phone}
                </Button>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={() => {
                    const form = document.getElementById('lead-form')
                    if (form) {
                      const headerHeight = 140 // Account for sticky header height
                      const elementPosition = form.getBoundingClientRect().top + window.pageYOffset
                      const offsetPosition = elementPosition - headerHeight
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    } else {
                      window.location.href = '/#lead-form'
                    }
                    setIsMenuOpen(false)
                  }}
                >
                  Connect with Specialists
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Emergency alert banner */}
      <div className="bg-warning-50 border-b border-warning-200 w-full overflow-hidden">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center text-center">
            <p className="text-sm text-warning-800">
              🚨 <strong>Compliance Emergency?</strong> We offer 24/7 emergency pickup for failed inspections.
              <a 
                href={`tel:${SITE_CONFIG.phoneClean}`} 
                className="font-semibold underline ml-2 hover:text-warning-900"
              >
                Call Now →
              </a>
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}