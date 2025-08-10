// NO "use client" - This is now a SERVER COMPONENT!
// Enterprise-grade tree-shaking via Next.js modularizeImports
import { Shield, ChevronDown } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"
import dynamic from "next/dynamic"

// Import our new client components
import { ComplianceDeadline } from "@/app/components/client/ComplianceDeadline"
import { ScrollToFormButton } from "@/app/components/client/ScrollToFormButton"
import { PhoneCallButton } from "@/app/components/client/PhoneCallButton"
import { FloatingCTA } from "@/app/components/client/FloatingCTA"
import { Clock, AlertCircle, Star, CheckCircle } from "@/app/components/client/DynamicIcons"
// Direct import to test lead form
import ProgressiveLeadForm from "@/components/forms/ProgressiveLeadForm"

// Professional dynamic imports - clean and reliable
// const ProgressiveLeadForm = dynamic(
//   () => import("@/components/forms/ProgressiveLeadForm"),
//   { 
//     loading: () => <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg mx-auto animate-pulse h-96">Loading form...</div>,
//     ssr: false 
//   }
// )

const TrustBadges = dynamic(
  () => import("@/components/conversion/TrustBadges"),
  { loading: () => <div className="h-12 animate-pulse bg-gray-100"></div> }
)

const UrgencyBanner = dynamic(
  () => import("@/components/conversion/UrgencyBanner"),
  { loading: () => <div className="h-12 animate-pulse bg-yellow-50"></div> }
)

const SocialProofTicker = dynamic(
  () => import("@/components/conversion/SocialProofTicker"),
  { loading: () => <div className="h-16 animate-pulse bg-gray-50"></div> }
)

export default function HomePage() {
  // NO useState, NO useEffect - this is SERVER SIDE!
  
  return (
    <>
      {/* SEO-Optimized H1 for Brand Authority - INVISIBLE TO USERS */}
      <h1 className="sr-only">
        Pharmaceutical Waste Disposal - America's Premier EPA Certified DEA Registered Medical Waste Management Company Serving 2,847+ Healthcare Facilities Nationwide
      </h1>

      {/* Urgency Banner for Compliance - EXACTLY THE SAME */}
      <UrgencyBanner />

      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-20">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Column - Value Proposition */}
            <div className="space-y-4 sm:space-y-6">
              {/* Primary Headline with Main Keywords */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="text-primary-600">Pharmaceutical Waste Disposal</span> Specialists
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4">
                  We connect you with certified disposal specialists who handle your exact waste type. 
                  <span className="font-semibold text-gray-900"> Skip the research. Get multiple quotes. One call.</span>
                </p>
              </div>

              {/* Trust Indicators - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">2,847+ Successful Facility Matches</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">15-Min Specialist Connection</span>
                </div>
              </div>

              {/* Competitor Comparison - Mobile Optimized */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <h3 className="font-bold text-base sm:text-lg mb-3">
                  Why Healthcare Facilities Use Our Specialist Network:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Pre-Vetted Specialists</strong> - We work with certified professionals, not random haulers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Competitive Quotes</strong> - Multiple certified partners compete for your business</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base"><strong>Expert Guidance</strong> - We know who handles what, where, and for how much</span>
                  </li>
                </ul>
              </div>

              {/* Mobile CTA - Enhanced */}
              <div className="lg:hidden">
                <ScrollToFormButton
                  variant="cta"
                  size="xl"
                  className="w-full py-4"
                >
                  <span className="sm:hidden">Get Free Quote</span>
                  <span className="hidden sm:inline">Connect with Certified Specialists</span>
                  <ChevronDown className="ml-2 h-5 w-5" />
                </ScrollToFormButton>
              </div>

              {/* Social Proof - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong>2,847 facilities</strong> connected with specialist partners through our service
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Lead Form */}
            <div id="lead-form">
              <ProgressiveLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Service Overview - Mobile Optimized */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            We Connect You with Specialists for Every Waste Type
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Controlled Substances */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="bg-primary-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Controlled Substance Disposal</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                We connect you with specialists who handle controlled medications with full compliance documentation. 
                Our partners provide witness destruction services for regulated pharmaceutical waste.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>All controlled medications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Reverse distribution available</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Witness destruction certificates</span>
                </li>
              </ul>
            </div>

            {/* Hazardous Pharmaceutical Waste */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="bg-primary-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Hazardous Pharmaceutical Waste</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Our network includes specialists for classified and hazardous pharmaceutical waste. 
                Partners provide certified hazardous drug waste management with full documentation.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Classified pharmaceutical waste</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Chemotherapy waste disposal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Complete manifest tracking</span>
                </li>
              </ul>
            </div>

            {/* Medical Waste Disposal */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <div className="bg-primary-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Medical Waste Disposal Services</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                We match you with partners for complete medical waste management. Our network handles sharps, 
                expired medications, and pharmaceutical waste pickup for healthcare facilities.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Sharps container disposal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Expired drug disposal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-500 flex-shrink-0" />
                  <span>Regular pickup schedules</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <ScrollToFormButton
              variant="cta"
              size="xl"
            >
              <span className="sm:hidden">Get Quote</span>
              <span className="hidden sm:inline">Connect with Your Specialist Partner</span>
              <ChevronDown className="ml-2 h-5 w-5" />
            </ScrollToFormButton>
          </div>
        </div>
      </section>

      {/* Compliance Section - More Keywords */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Stay Compliant with Pharmaceutical Waste Regulations
            </h2>
            
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning-600 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    <ComplianceDeadline />
                  </h3>
                  <p className="text-gray-700">
                    Regulatory agencies are increasing pharmaceutical waste disposal audits by 40% this year. 
                    Facilities without proper medical waste management face fines up to $37,500 per day.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">We Ensure Compliance With:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Federal Regulations:</strong> Hazardous pharmaceutical waste compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Drug Control Requirements:</strong> Controlled substance disposal procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>State Regulations:</strong> Local pharmaceutical waste disposal laws</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Joint Commission:</strong> Hospital waste management standards</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Industries We Serve:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Hospitals:</strong> Complete hospital pharmaceutical waste disposal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Retail Pharmacies:</strong> CVS, Walgreens, independent pharmacies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Long-Term Care:</strong> Nursing home medication disposal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Veterinary:</strong> Animal pharmaceutical waste management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-2 sm:px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Skip the Research. Get Connected with Specialists Today.
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join 2,847 facilities that found their perfect disposal partner through our network. 
            Multiple quotes. Certified specialists. Expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ScrollToFormButton
              variant="default"
              size="xl"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              <span className="sm:hidden">Get Free Quote</span>
              <span className="hidden sm:inline">Connect with Certified Disposal Specialists</span>
            </ScrollToFormButton>
            <PhoneCallButton />
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Pharmaceutical Waste Disposal FAQs
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  What is pharmaceutical waste disposal?
                </h3>
                <p className="text-gray-600">
                  Pharmaceutical waste disposal is the safe, compliant management and destruction of expired, 
                  unused, or contaminated medications from healthcare facilities. This includes controlled 
                  substances, hazardous drugs, and chemotherapy waste that require special handling per EPA 
                  and DEA regulations.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  How much does pharmaceutical waste disposal cost?
                </h3>
                <p className="text-gray-600">
                  Pharmaceutical waste disposal costs typically range from $150-1,200 per month depending on 
                  volume and waste types. We offer 30-40% savings compared to Stericycle and Waste Management, 
                  with transparent pricing and no hidden fees.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  What types of pharmaceutical waste do you handle?
                </h3>
                <p className="text-gray-600">
                  We handle all types of pharmaceutical waste including: DEA controlled substances (Schedule I-V), 
                  RCRA hazardous waste (P-listed and U-listed), chemotherapy drugs, expired medications, sharps, 
                  and non-hazardous pharmaceutical waste. Our medical waste disposal services cover everything 
                  from hospitals to retail pharmacies.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  Are you DEA and EPA compliant?
                </h3>
                <p className="text-gray-600">
                  Yes, we are fully DEA registered and EPA certified for pharmaceutical waste disposal. We provide 
                  all necessary documentation including DEA Form 41 witness certificates, EPA manifests, and 
                  certificates of destruction to ensure your facility maintains complete compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Ticker */}
      <SocialProofTicker />

      {/* Floating CTA for Mobile - Client Component */}
      <FloatingCTA />
    </>
  )
}