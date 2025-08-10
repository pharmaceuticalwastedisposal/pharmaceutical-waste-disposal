"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Shield, Clock, CheckCircle } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const serviceLinks = [
    { name: "Controlled Substance Disposal", href: "/services/controlled-substance-disposal" },
    { name: "Pharmaceutical Waste Disposal", href: "/services/pharmaceutical-waste-disposal" },
    { name: "Medical Waste Disposal", href: "/services/medical-waste-disposal" },
    { name: "Sharps Container Disposal", href: "/services/sharps-container-disposal" },
    { name: "Hazardous Drug Waste", href: "/services/hazardous-drug-waste" },
    { name: "Expired Medication Disposal", href: "/services/expired-medication-disposal" },
  ]

  const locationLinks = [
    { name: "California", href: "/pharmaceutical-waste-disposal-california" },
    { name: "Texas", href: "/pharmaceutical-waste-disposal-texas" },
    { name: "Florida", href: "/pharmaceutical-waste-disposal-florida" },
    { name: "New York", href: "/pharmaceutical-waste-disposal-new-york" },
    { name: "Illinois", href: "/pharmaceutical-waste-disposal-illinois" },
    { name: "Pennsylvania", href: "/pharmaceutical-waste-disposal-pennsylvania" },
  ]

  const competitorLinks = [
    { name: "Stericycle Alternative", href: "/stericycle-alternative" },
    { name: "Waste Management Alternative", href: "/waste-management-alternative" },
    { name: "Daniels Health Alternative", href: "/daniels-health-alternative" },
    { name: "US Ecology Alternative", href: "/us-ecology-alternative" },
  ]

  const resourceLinks = [
    { name: "Regulatory Compliance Guide", href: "/resources/regulatory-compliance-guide" },
    { name: "Drug Disposal Forms Guide", href: "/resources/drug-disposal-forms-guide" },
    { name: "State Regulations", href: "/resources/state-regulations" },
    { name: "Cost Calculator", href: "/resources/cost-calculator" },
    { name: "Compliance Checklist", href: "/resources/compliance-checklist" },
    { name: "Industry News", href: "/resources/industry-news" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-600 rounded-lg p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">PharmaceuticalWasteDisposal.com</div>
                <div className="text-xs text-gray-300">Licensed • Certified • Compliant</div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              America's trusted pharmaceutical waste disposal specialists. 
              Connecting healthcare facilities with certified partners nationwide.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary-400" />
                <a href={`tel:${SITE_CONFIG.phoneClean}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary-400 mt-0.5" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors break-all">
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Nationwide Service</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle className="h-3 w-3 text-secondary-400" />
                <span>Zero Violations Since 2016</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Clock className="h-3 w-3 text-secondary-400" />
                <span>2,847 Facilities Served</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-bold text-lg mb-4">Locations</h3>
            <ul className="space-y-2">
              {locationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm block"
                  >
                    Pharma Waste Disposal {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/locations"
                  className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                >
                  View All Locations →
                </Link>
              </li>
            </ul>
          </div>

          {/* Alternatives */}
          <div>
            <h3 className="font-bold text-lg mb-4">Alternatives</h3>
            <ul className="space-y-2">
              {competitorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold text-sm mb-2">Why Switch?</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• 30-40% cost savings</li>
                <li>• No hidden fees</li>
                <li>• Faster response times</li>
                <li>• Month-to-month contracts</li>
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              <p className="text-gray-300 text-sm">
                © {currentYear} PharmaceuticalWasteDisposal.com. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <span>|</span>
                <Link href="/terms-of-service" className="hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
                <span>|</span>
                <Link href="/sitemap" className="hover:text-gray-300 transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield className="h-3 w-3" />
                <span>Licensed Provider</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle className="h-3 w-3" />
                <span>Fully Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema markup for footer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPoint",
            "telephone": SITE_CONFIG.phone,
            "contactType": "customer service",
            "email": SITE_CONFIG.email,
            "availableLanguage": "English",
            "areaServed": "US",
          }),
        }}
      />
    </footer>
  )
}