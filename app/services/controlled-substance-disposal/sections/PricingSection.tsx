"use client"

import { CheckCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PricingSectionProps {
  scrollToForm: () => void
}

export default function PricingSection({ scrollToForm }: PricingSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Controlled Substance Disposal Cost & Pricing
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Transparent pricing with no hidden fees - save 30-40% vs. major competitors
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-2">Small Volume</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">$200-400</div>
              <div className="text-gray-600 mb-4">per pickup</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Up to 10 lbs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Quarterly service</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Form 41 included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Witness destruction</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-primary-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Medium Volume</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">$400-600</div>
              <div className="text-gray-600 mb-4">per pickup</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>10-50 lbs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Monthly service</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Priority scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Compliance support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-2">Large Volume</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">$600+</div>
              <div className="text-gray-600 mb-4">custom pricing</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>50+ lbs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Weekly/on-demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary-500" />
                  <span>Volume discounts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Savings Calculator CTA */}
          <div className="mt-12 bg-primary-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              See How Much You Can Save
            </h3>
            <p className="text-lg mb-6">
              Most facilities save $3,000-12,000 annually by switching from Stericycle or Waste Management
            </p>
            <Button
              variant="default"
              size="xl"
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={scrollToForm}
            >
              Calculate Your Savings
              <DollarSign className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}