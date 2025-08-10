"use client"

import { Button } from "@/components/ui/button"
import ProgressiveLeadForm from "@/components/forms/ProgressiveLeadForm"
import TrustBadges from "@/components/conversion/TrustBadges"
import { CheckCircle, X, DollarSign, Clock, Phone, ArrowRight } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"

// Metadata moved to layout.tsx since this is now a client component

export default function StericycleAlternativePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Stericycle Alternative - Better Pharmaceutical Waste Disposal",
            "description": "Compare pharmaceutical waste disposal services. Save 30-40% vs Stericycle with better compliance and customer service.",
            "url": "https://pharmaceuticalwastedisposal.com/stericycle-alternative",
            "about": {
              "@type": "Service",
              "name": "Pharmaceutical Waste Disposal",
              "provider": {
                "@type": "Organization",
                "name": SITE_CONFIG.name
              }
            }
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <DollarSign className="h-4 w-4" />
                  Average Savings: $4,800/Year
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  The <span className="text-red-600">Stericycle Alternative</span> That Actually Works
                </h1>
                <p className="text-xl text-gray-600 mt-4">
                  Join 400+ healthcare facilities that switched from Stericycle and save 
                  <span className="font-bold text-gray-900"> 30-40% on pharmaceutical waste disposal</span> 
                  while getting better service and faster response times.
                </p>
              </div>

              {/* Switch Benefits */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-3">
                  Why Facilities Leave Stericycle:
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Hidden fees and surprise price increases (average 15-25% annually)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Poor customer service and long hold times</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Missed pickups and scheduling issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 mt-0.5" />
                    <span>Long-term contracts that lock you in</span>
                  </li>
                </ul>
              </div>

              {/* Social Proof */}
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-800 font-semibold mb-2">Recent Stericycle Switch:</p>
                <p className="text-sm text-green-700">
                  "Memorial Hospital saved $67,000/year after switching from Stericycle. 
                  Better service, same compliance, no hidden fees." - Janet, Hospital Administrator
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Calculate Your Stericycle Savings
                  </h3>
                  <p className="text-gray-600">
                    See exactly how much you'll save by switching
                  </p>
                </div>
                <ProgressiveLeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* Detailed Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Stericycle vs PharmaceuticalWasteDisposal.com
          </h2>
          
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Feature column */}
                <div className="bg-gray-100 p-6">
                  <div className="font-bold text-lg mb-8">Features</div>
                  <div className="space-y-6">
                    <div className="font-semibold">Pricing Transparency</div>
                    <div className="font-semibold">Customer Service</div>
                    <div className="font-semibold">Response Time</div>
                    <div className="font-semibold">Contract Terms</div>
                    <div className="font-semibold">Hidden Fees</div>
                    <div className="font-semibold">Missed Pickups</div>
                    <div className="font-semibold">Compliance Support</div>
                    <div className="font-semibold">Pharmaceutical Focus</div>
                    <div className="font-semibold">Average Savings</div>
                  </div>
                </div>

                {/* Stericycle column */}
                <div className="p-6 border-r border-gray-200">
                  <div className="font-bold text-lg text-center mb-8 text-red-600">Stericycle</div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Complex pricing, hard to understand</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Long hold times, outsourced support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-sm">24-48 hours for quotes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Long-term contracts required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Environmental fees, fuel surcharges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Frequent scheduling issues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Basic compliance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Generic medical waste focus</span>
                    </div>
                    <div className="text-center font-bold text-red-600">Baseline Cost</div>
                  </div>
                </div>

                {/* Our service column */}
                <div className="p-6 bg-green-50">
                  <div className="font-bold text-lg text-center mb-8 text-green-600">PharmaceuticalWasteDisposal.com</div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Transparent, itemized pricing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Direct line to specialists</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">15-minute response guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Month-to-month flexibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">No hidden fees, ever</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">99.7% on-time pickup rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Proactive compliance alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Pharmaceutical specialists only</span>
                    </div>
                    <div className="text-center font-bold text-green-600">Save 30-40%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Switching Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Switching from Stericycle is Easy
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">We Handle Everything</h3>
                <p className="text-gray-600">
                  No need to call Stericycle. We handle contract cancellation, 
                  final pickup coordination, and all transition details.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Zero Service Interruption</h3>
                <p className="text-gray-600">
                  We coordinate with your current schedule to ensure no gaps 
                  in service. Your first pickup happens right on time.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Start Saving Immediately</h3>
                <p className="text-gray-600">
                  See savings from month one, plus we offer a switch bonus: 
                  first month free for Stericycle customers.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 inline-block">
                <div className="flex items-center gap-3 text-yellow-800">
                  <Clock className="h-6 w-6" />
                  <div>
                    <p className="font-bold">Limited Time Switch Bonus</p>
                    <p className="text-sm">First month free + lock in current pricing for 24 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Successful Stericycle Switches
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold">Memorial Hospital</h3>
                  <p className="text-sm text-gray-600">Los Angeles, CA</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                "Stericycle kept raising prices with hidden fees. We switched and 
                immediately saved $67,000/year with better service."
              </p>
              <p className="font-semibold text-green-600">Annual Savings: $67,000</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold">Regional Pharmacy Chain</h3>
                  <p className="text-sm text-gray-600">Texas (15 locations)</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                "Stericycle missed pickups constantly. Since switching, we've had 
                zero missed pickups and saved 35% per location."
              </p>
              <p className="font-semibold text-green-600">Total Savings: $89,000/year</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-green-100 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold">St. Mary's Medical Center</h3>
                  <p className="text-sm text-gray-600">Chicago, IL</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                "The switch was seamless. Customer service is night and day better, 
                and we're saving $43,000 annually."
              </p>
              <p className="font-semibold text-green-600">Annual Savings: $43,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Leave Stericycle Behind?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join 400+ facilities that switched and saved an average of $4,800/year. 
            Get your custom savings analysis in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="xl"
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Calculate My Stericycle Savings
              <ArrowRight className="ml-2 h-5 w-5" />
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
          
          <div className="mt-8 text-green-100 text-sm">
            <p>✓ No obligation quote ✓ Switch handled for you ✓ First month free</p>
          </div>
        </div>
      </section>
    </>
  )
}