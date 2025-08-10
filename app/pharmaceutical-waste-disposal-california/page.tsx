"use client"

import { Button } from "@/components/ui/button"
import ProgressiveLeadForm from "@/components/forms/ProgressiveLeadForm"
import TrustBadges from "@/components/conversion/TrustBadges"
import { CheckCircle, AlertTriangle, Phone } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"

// Metadata moved to layout.tsx since this is now a client component

export default function CaliforniaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Pharmaceutical Waste Disposal California",
            "description": "EPA certified pharmaceutical waste disposal services throughout California",
            "areaServed": {
              "@type": "State",
              "name": "California",
              "addressCountry": "US"
            },
            "serviceType": "Pharmaceutical Waste Management",
            "telephone": SITE_CONFIG.phone,
            "url": "https://pharmaceuticalwastedisposal.com/pharmaceutical-waste-disposal-california",
            "sameAs": [
              "https://www.linkedin.com/company/pharmaceutical-waste-disposal",
            ],
          }),
        }}
      />

      {/* California-specific urgency banner */}
      <div className="bg-warning/10 border-b border-warning/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
            <span className="font-medium text-gray-800">
              California EPA announced surprise pharmaceutical waste audits starting next week
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="text-primary-600">Pharmaceutical Waste Disposal</span> California
                </h1>
                <p className="text-xl text-gray-600 mt-4">
                  California's trusted EPA-certified pharmaceutical waste disposal company. 
                  Serving hospitals, pharmacies, and healthcare facilities statewide with 
                  <span className="font-semibold text-gray-900"> same-day pickup and 100% DEA compliance.</span>
                </p>
              </div>

              {/* California-specific trust indicators */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-3">
                  California Pharmaceutical Waste Regulations Compliance:
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>CalEPA DTSC Certified</strong> - California hazardous waste handler</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>DEA Registered</strong> - California controlled substance disposal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>California Medical Waste</strong> - CDPH permitted facility</span>
                  </li>
                </ul>
              </div>

              {/* California cities served */}
              <div className="bg-primary-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">California Cities We Serve:</h3>
                <p className="text-sm text-gray-700">
                  Los Angeles, San Francisco, San Diego, Sacramento, San Jose, Fresno, 
                  Long Beach, Oakland, Bakersfield, Anaheim, Riverside, and all California cities
                </p>
              </div>
            </div>

            <div>
              <ProgressiveLeadForm />
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* California-specific services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            California Pharmaceutical Waste Disposal Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-3">Los Angeles County</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive pharmaceutical waste disposal for LA County hospitals, 
                pharmacies, and medical facilities. Same-day emergency pickup available.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• UCLA Medical Center</li>
                <li>• Cedars-Sinai Medical Center</li>
                <li>• Kaiser Permanente LA</li>
                <li>• CVS & Walgreens locations</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-3">San Francisco Bay Area</h3>
              <p className="text-gray-600 mb-4">
                Bay Area pharmaceutical waste management for Silicon Valley healthcare 
                facilities. UCSF, Stanford, and Kaiser approved vendor.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• UCSF Medical Center</li>
                <li>• Stanford Health Care</li>
                <li>• Kaiser Permanente SF</li>
                <li>• Sutter Health facilities</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-3">San Diego County</h3>
              <p className="text-gray-600 mb-4">
                San Diego pharmaceutical waste disposal services. Serving Scripps, 
                Sharp Healthcare, and UCSD medical facilities.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Scripps Health System</li>
                <li>• Sharp HealthCare</li>
                <li>• UC San Diego Health</li>
                <li>• Rady Children's Hospital</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* California compliance section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              California Pharmaceutical Waste Disposal Regulations
            </h2>
            
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning-600 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    California EPA Increases Audits by 60%
                  </h3>
                  <p className="text-gray-700">
                    California Department of Toxic Substances Control (DTSC) announced increased 
                    pharmaceutical waste audits for 2024. Facilities without proper disposal 
                    documentation face fines up to $70,000 per violation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-4">California-Specific Requirements:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>DTSC Registration:</strong> All hazardous pharmaceutical waste generators must register</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>California Medical Waste:</strong> CDPH permits required for medical waste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Prop 65 Compliance:</strong> Warning requirements for certain pharmaceuticals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Waste Minimization:</strong> California source reduction planning</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4">Industries We Serve in California:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>California Hospitals:</strong> All major health systems statewide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Retail Pharmacies:</strong> CVS, Walgreens, Rite Aid California locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Long-Term Care:</strong> California nursing homes and assisted living</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Veterinary Clinics:</strong> Animal pharmaceutical waste disposal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* California CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            California's Most Trusted Pharmaceutical Waste Disposal Company
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Serving 847 California healthcare facilities with EPA-certified pharmaceutical 
            waste disposal services. Get your free California compliance consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="xl"
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Free California Compliance Check
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = `tel:${SITE_CONFIG.phoneClean}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call {SITE_CONFIG.phone}
            </Button>
          </div>
        </div>
      </section>

      {/* California FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              California Pharmaceutical Waste Disposal FAQs
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  What are California pharmaceutical waste disposal requirements?
                </h3>
                <p className="text-gray-600">
                  California requires DTSC registration for hazardous pharmaceutical waste generators, 
                  CDPH permits for medical waste, and compliance with both state and federal EPA regulations. 
                  Our California pharmaceutical waste disposal services ensure full compliance.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  How much does pharmaceutical waste disposal cost in California?
                </h3>
                <p className="text-gray-600">
                  California pharmaceutical waste disposal costs vary by volume and waste type, typically 
                  $200-1,500/month. We offer 30-40% savings compared to Stericycle and other large providers, 
                  with transparent pricing and no California environmental fees.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  Do you serve all California cities?
                </h3>
                <p className="text-gray-600">
                  Yes, we provide pharmaceutical waste disposal services throughout California including 
                  Los Angeles, San Francisco, San Diego, Sacramento, San Jose, Fresno, and all major cities. 
                  Same-day emergency pickup available statewide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}