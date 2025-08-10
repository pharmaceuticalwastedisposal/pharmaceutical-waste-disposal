"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Download, Calendar, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"

export default function ThankYouPage() {
  const [timeUntilCall, setTimeUntilCall] = useState(15)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilCall((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Success Header */}
      <div className="bg-secondary-500 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Your Compliance Report is Ready!</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Main Success Message */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-secondary-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-secondary-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-4">
              Thank You! Your Free Pharmaceutical Waste Disposal Compliance Check is Complete
            </h1>

            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
              <p className="text-center font-semibold text-warning-800">
                ⏰ A compliance specialist will call you within {timeUntilCall} minutes
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                <div>
                  <p className="font-semibold">Compliance report sent to your email</p>
                  <p className="text-sm text-gray-600">Check your inbox for detailed analysis</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                <div>
                  <p className="font-semibold">Custom pricing prepared</p>
                  <p className="text-sm text-gray-600">Based on your facility type and volume</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                <div>
                  <p className="font-semibold">Savings analysis complete</p>
                  <p className="text-sm text-gray-600">Average savings: 35% vs current providers</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="cta"
                size="lg"
                className="w-full"
                onClick={() => {
                  // Download compliance checklist
                  window.open('/compliance-checklist.pdf', '_blank')
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Compliance Checklist
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  // Open calendar scheduling
                  window.open('https://calendly.com/pharmaceutical-waste-disposal/consultation', '_blank')
                }}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary-100 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Phone Consultation (5 minutes)</h3>
                  <p className="text-gray-600">
                    Our pharmaceutical waste disposal specialist will review your specific compliance needs 
                    and answer any questions about DEA and EPA regulations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary-100 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Custom Medical Waste Management Plan</h3>
                  <p className="text-gray-600">
                    We'll create a tailored pharmaceutical waste disposal solution for your facility, 
                    including pickup schedules, container sizing, and compliance documentation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary-100 rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Seamless Switch (If You're Ready)</h3>
                  <p className="text-gray-600">
                    We handle everything - contract cancellation with Stericycle or current provider, 
                    container delivery, and first pickup. Zero service interruption guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Offers */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Limited Time Offers</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">First Month Free for Stericycle Customers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Free Compliance Audit ($500 Value)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Lock in 2024 Pricing (No Increases for 24 Months)</span>
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100 w-full md:w-auto"
              onClick={() => window.location.href = `tel:${SITE_CONFIG.phoneClean}`}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: {SITE_CONFIG.phone}
            </Button>
          </div>

          {/* Resources */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Free Pharmaceutical Waste Disposal Resources
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/resources/dea-form-41-guide"
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary-600">
                  DEA Form 41 Guide
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Complete guide to controlled substance disposal documentation
                </p>
                <span className="text-primary-600 text-sm font-semibold flex items-center">
                  Download PDF
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>

              <a
                href="/resources/epa-compliance-checklist"
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary-600">
                  EPA Compliance Checklist
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Ensure your facility meets all hazardous waste requirements
                </p>
                <span className="text-primary-600 text-sm font-semibold flex items-center">
                  Download PDF
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>

              <a
                href="/resources/cost-calculator"
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary-600">
                  Cost Savings Calculator
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Calculate your savings vs Stericycle & Waste Management
                </p>
                <span className="text-primary-600 text-sm font-semibold flex items-center">
                  Use Calculator
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}