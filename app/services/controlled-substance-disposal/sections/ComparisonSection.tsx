"use client"

import { TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComparisonSectionProps {
  scrollToForm: () => void
}

export default function ComparisonSection({ scrollToForm }: ComparisonSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Better Than Stericycle & Waste Management
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-primary-600 text-white">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center">Our Network</th>
                  <th className="p-4 text-center">Stericycle</th>
                  <th className="p-4 text-center">Waste Management</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Average Cost</td>
                  <td className="p-4 text-center text-secondary-600 font-bold">30-40% Less</td>
                  <td className="p-4 text-center">Premium Pricing</td>
                  <td className="p-4 text-center">Premium Pricing</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-semibold">Contract Terms</td>
                  <td className="p-4 text-center text-secondary-600 font-bold">Month-to-Month</td>
                  <td className="p-4 text-center">3-5 Year Lock-in</td>
                  <td className="p-4 text-center">Multi-Year Required</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Hidden Fees</td>
                  <td className="p-4 text-center text-secondary-600 font-bold">None</td>
                  <td className="p-4 text-center">Fuel, Environmental, Admin</td>
                  <td className="p-4 text-center">Multiple Add-ons</td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="p-4 font-semibold">Response Time</td>
                  <td className="p-4 text-center text-secondary-600 font-bold">Same Day Available</td>
                  <td className="p-4 text-center">3-5 Days</td>
                  <td className="p-4 text-center">5-7 Days</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Customer Service</td>
                  <td className="p-4 text-center text-secondary-600 font-bold">Dedicated Rep</td>
                  <td className="p-4 text-center">Call Center</td>
                  <td className="p-4 text-center">Automated System</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="cta"
              size="xl"
              onClick={scrollToForm}
            >
              Switch & Save Today
              <TrendingDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}