import { Metadata } from "next"
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileCheck,
  Lock,
  Users,
  TrendingDown
} from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"
import Link from "next/link"
import dynamic from "next/dynamic"

// Import critical above-fold components statically for better LCP
import { LeadFormWrapper } from "./ClientComponents"

const FinalCTAButtons = dynamic(
  () => import("./ClientComponents").then(mod => ({ default: mod.FinalCTAButtons })),
  { loading: () => <div className="h-16 animate-pulse bg-gray-200 rounded"></div> }
)

const FloatingMobileCTA = dynamic(
  () => import("./ClientComponents").then(mod => ({ default: mod.FloatingMobileCTA })),
  { ssr: false }
)

const BelowFoldSections = dynamic(
  () => import("./ClientComponents").then(mod => ({ default: mod.BelowFoldSections })),
  { loading: () => <div className="py-16 animate-pulse"><div className="h-96 bg-gray-100"></div></div> }
)

// Import CTASection statically since it appears in above-fold process section
import { CTASection } from "./components/CTASection"

// Server component with metadata
export const metadata: Metadata = {
  title: "Controlled Substance Disposal Services | DEA Compliant",
  description: "DEA-compliant controlled substance disposal for Schedule I-V drugs. Form 41 processing, witness destruction. Save 30% vs competitors. Serving 2,847+ facilities.",
  openGraph: {
    title: "Controlled Substance Disposal Services | DEA Compliant",
    description: "DEA-compliant controlled substance disposal for Schedule I-V drugs. Form 41 processing, witness destruction. Save 30% vs competitors.",
    url: "https://pharmaceuticalwastedisposal.com/services/controlled-substance-disposal",
    type: "website",
    images: [
      {
        url: "https://pharmaceuticalwastedisposal.com/images/controlled-substance-disposal.jpg",
        width: 1200,
        height: 630,
        alt: "DEA Compliant Controlled Substance Disposal Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Controlled Substance Disposal Services | DEA Compliant",
    description: "DEA-registered controlled substance disposal for Schedule I-V drugs. Form 41 processing, witness destruction.",
    images: ["https://pharmaceuticalwastedisposal.com/images/controlled-substance-disposal.jpg"]
  },
  alternates: {
    canonical: "https://pharmaceuticalwastedisposal.com/services/controlled-substance-disposal"
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1
  }
}

// Server Component - Pure static HTML, no JavaScript bundle
export default function ControlledSubstanceDisposalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": "DEA Drug Destruction Services",
        "alternateName": "Controlled Substance Disposal Services",
        "description": "America's leading DEA disposal company providing registered destruction services for Schedule I-V narcotics with Form 41 compliant witness destruction",
        "provider": {
          "@type": "Organization",
          "name": "Controlled Substance Disposal Company",
          "legalName": "PharmaceuticalWasteDisposal.com",
          "alternateName": ["Pharmaceutical Waste Disposal", "America's Leading DEA Disposal Company"],
          "telephone": SITE_CONFIG.phone,
          "email": SITE_CONFIG.email,
          "description": "America's premier controlled substance disposal company serving 2,847+ healthcare facilities nationwide",
          "knowsAbout": ["DEA Form 41", "Controlled Drug Destruction", "Schedule I-V Disposal", "Witness Destruction", "DEA Compliance", "21 CFR 1317"],
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "DEA Registration",
            "name": "DEA Registered Reverse Distributor"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "2847",
            "bestRating": "5"
          }
        },
        "serviceType": "DEA Controlled Substance Destruction",
        "category": "Medical Waste Management",
        "offers": {
          "@type": "Offer",
          "priceRange": "$200 - $800 per pickup",
          "description": "30-40% less than Stericycle and Waste Management",
          "availability": "https://schema.org/InStock"
        },
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "Healthcare Facilities"
        }
      },
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section - Static HTML, renders immediately */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              {/* Breadcrumbs */}
              <nav className="text-sm text-gray-600">
                <Link href="/" className="hover:text-primary-600">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Controlled Substance Disposal</span>
              </nav>

              {/* H1 - Critical for LCP */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  <span className="text-primary-600">Controlled Substance Disposal</span> Services
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mt-3 sm:mt-4 break-words">
                  As America's premier DEA disposal company specializing in Schedule I-V narcotics, we connect you with registered reverse distributors for compliant controlled substance management. 
                  <span className="font-semibold text-gray-900"> DEA Form 41 processing, witness destruction per 21 CFR 1317, and full compliance documentation included.</span>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 max-w-full">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">DEA Registered Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Form 41 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-500 flex-shrink-0" />
                  <span className="font-semibold text-sm sm:text-base">Same-Day Pickup</span>
                </div>
              </div>

              {/* Value Proposition Box */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
                <h2 className="text-lg sm:text-xl font-bold mb-4">
                  Why 2,847+ Facilities Choose America's Leading DEA Disposal Company:
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <div>
                      <strong>100% DEA Compliant</strong> - All partners are DEA registered reverse distributors
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <div>
                      <strong>30-40% Cost Savings</strong> - Better rates than Stericycle or Waste Management
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <div>
                      <strong>Zero Violations Since 2016</strong> - Perfect compliance record across all partners
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Lead Form - Client Component loads separately */}
            <div id="lead-form">
              <LeadFormWrapper />
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview Section - Static HTML */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              What is DEA-Compliant Drug Destruction?
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Safe, compliant destruction of Schedule I-V narcotics following federal regulations
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Schedule Classifications We Handle</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>Schedule II:</strong> Oxycodone, Morphine, Fentanyl, Adderall
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>Schedule III:</strong> Codeine combinations, Anabolic steroids
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>Schedule IV:</strong> Benzodiazepines, Ambien, Tramadol
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>Schedule V:</strong> Cough preparations, Lyrica
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Disposal Methods We Coordinate</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Lock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>Witness Destruction:</strong> Two authorized witnesses present
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>Reverse Distribution:</strong> DEA-authorized return and credit
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>On-Site Destruction:</strong> Mobile destruction units available
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <div>
                      <strong>Mail-Back Programs:</strong> For small quantities
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Static HTML */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              America's Most Trusted DEA-Compliant Destruction Process
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Our proven 5-step drug destruction process has served 2,847+ healthcare facilities with zero compliance violations since 2016
            </p>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Inventory Assessment",
                  description: "We help you catalog controlled substances for disposal and determine the best disposal method"
                },
                {
                  step: "2",
                  title: "DEA Form 41 Preparation",
                  description: "Our partners prepare and submit all required DEA documentation for your facility"
                },
                {
                  step: "3",
                  title: "Secure Collection",
                  description: "DEA-registered collectors arrive with tamper-evident containers and chain of custody forms"
                },
                {
                  step: "4",
                  title: "Witness Destruction",
                  description: "Two authorized employees witness the destruction process per DEA requirements"
                },
                {
                  step: "5",
                  title: "Documentation & Certificates",
                  description: "Receive complete documentation including certificates of destruction for your records"
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <CTASection text="Start Your DEA Disposal Process" />
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Requirements Section - Static HTML */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              DEA Drug Destruction Requirements
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Stay compliant with federal drug destruction regulations and state requirements
            </p>

            {/* Warning Box */}
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning-600 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    URGENT: DEA Increases Controlled Substance Audits by 45% in 2024
                  </h3>
                  <p className="text-gray-700">
                    The DEA has announced increased enforcement of controlled substance disposal practices. 
                    Healthcare facilities without proper DEA-compliant disposal documentation face fines up to $1.3 million per violation. 
                    <strong> Our controlled substance disposal company has maintained zero violations across 2,847+ facilities since 2016.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="font-bold text-xl mb-4">Federal DEA Requirements</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>21 CFR 1317:</strong> Disposal by registrants requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Form 41 Filing:</strong> Required for all destructions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Two Witnesses:</strong> Authorized employees must witness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Record Keeping:</strong> 2-year documentation retention</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="font-bold text-xl mb-4">State-Specific Requirements</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>California:</strong> CURES reporting within 3 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>New York:</strong> BNE notification requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Texas:</strong> DPS disposal permits needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span><strong>Florida:</strong> Quarterly reporting to DOH</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section - Static HTML */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Industries Requiring DEA Drug Destruction Services
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We connect DEA registrants across all healthcare sectors with compliant disposal partners
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Hospitals & Health Systems",
                description: "Hospital controlled substance disposal for pharmacy departments, OR suites, and emergency departments"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Retail & Mail-Order Pharmacies",
                description: "Pharmacy controlled substance disposal for CVS, Walgreens, independent pharmacies, and mail-order facilities"
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Long-Term Care Facilities",
                description: "Nursing home controlled substance disposal, assisted living facilities, and hospice care centers"
              },
              {
                icon: <FileCheck className="h-8 w-8" />,
                title: "Clinics & Surgery Centers",
                description: "Outpatient controlled substance disposal for pain clinics, surgery centers, and urgent care"
              },
              {
                icon: <Lock className="h-8 w-8" />,
                title: "Veterinary Practices",
                description: "Veterinary controlled substance disposal for animal hospitals and veterinary clinics"
              },
              {
                icon: <TrendingDown className="h-8 w-8" />,
                title: "Research Facilities",
                description: "Research controlled substance disposal for universities, pharmaceutical companies, and labs"
              }
            ].map((industry, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="text-primary-600 mb-4">{industry.icon}</div>
                <h3 className="text-xl font-bold mb-2">{industry.title}</h3>
                <p className="text-gray-600">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Guide Section - High-Intent SEO */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">
              DEA Drug Destruction Cost Guide 2024
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Transparent pricing for DEA-compliant drug destruction services
            </p>
            
            <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Average Monthly Costs by Facility Type</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Small Clinic/Pharmacy</span>
                  <span className="text-primary-600 font-bold">$200-400/month</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Medical Practice</span>
                  <span className="text-primary-600 font-bold">$300-600/month</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Surgery Center</span>
                  <span className="text-primary-600 font-bold">$500-900/month</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-medium">Hospital</span>
                  <span className="text-primary-600 font-bold">$800-2,500/month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Long-Term Care Facility</span>
                  <span className="text-primary-600 font-bold">$400-800/month</span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">What's Included</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span>DEA Form 41 preparation & filing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span>Witness destruction services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span>DOT-compliant transportation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span>Certificates of destruction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mt-0.5" />
                    <span>Compliance documentation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Cost Factors</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <TrendingDown className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span><strong>Volume:</strong> Higher volume = lower per-unit cost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingDown className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span><strong>Frequency:</strong> Regular pickups cost less</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingDown className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span><strong>Location:</strong> Urban areas typically lower</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingDown className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span><strong>Contract:</strong> Annual contracts save 20%+</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-primary-50 rounded-lg border-2 border-primary-200">
              <p className="text-center text-lg">
                <strong className="text-primary-700">Save 30-40% vs Stericycle & Waste Management</strong><br/>
                <span className="text-gray-700">Get your custom quote in 60 seconds</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQ Section - Target Featured Snippets */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions About DEA Drug Destruction
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">What is DEA drug destruction?</h3>
                <p className="text-gray-700">
                  DEA drug destruction is the federally-regulated process of destroying Schedule I-V narcotics including opioids, stimulants, depressants, hallucinogens, and anabolic steroids. The process requires Form 41 documentation, two authorized witnesses during destruction, and compliance with 21 CFR 1317 regulations. Only DEA-registered reverse distributors can legally handle and destroy these medications.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">How much does DEA drug destruction cost?</h3>
                <p className="text-gray-700">
                  Professional drug destruction costs typically range from $200-800 per pickup, depending on volume, location, and frequency. Small clinics average $200-400/month, medical practices $300-600/month, and hospitals $800-2,500/month. We offer 30-40% savings compared to Stericycle and Waste Management. Annual contracts provide additional 20% savings.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Who needs controlled substance disposal services?</h3>
                <p className="text-gray-700">
                  Any DEA registrant handling controlled substances requires proper disposal services, including:
                </p>
                <ul className="mt-3 ml-6 space-y-1 list-disc">
                  <li>Hospitals and health systems</li>
                  <li>Retail and mail-order pharmacies</li>
                  <li>Medical clinics and urgent care centers</li>
                  <li>Long-term care and assisted living facilities</li>
                  <li>Veterinary practices</li>
                  <li>Research laboratories and universities</li>
                </ul>
                <p className="mt-3 text-gray-700">
                  Failure to properly dispose can result in DEA fines up to $1.3 million per violation.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">What is DEA Form 41?</h3>
                <p className="text-gray-700">
                  DEA Form 41 (Registrant Record of Controlled Substances Destroyed) is the official federal form required when disposing of controlled substances. The form must document the name, strength, form, quantity, and DEA number of each controlled substance destroyed. Two authorized employees must witness the destruction and sign the form. Forms must be filed with the DEA within specific timeframes and copies retained for 2 years.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">How do I dispose of Schedule 2 drugs?</h3>
                <p className="text-gray-700">
                  Schedule 2 drugs (including oxycodone, morphine, fentanyl, Adderall, and Ritalin) require the most stringent disposal procedures:
                </p>
                <ol className="mt-3 ml-6 space-y-1 list-decimal">
                  <li>Contact a DEA-registered reverse distributor</li>
                  <li>Complete inventory of Schedule 2 substances</li>
                  <li>Prepare DEA Form 41 documentation</li>
                  <li>Arrange for two authorized witnesses</li>
                  <li>Conduct witnessed destruction</li>
                  <li>File Form 41 with DEA within 15 days</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">What happens if I don't properly dispose of controlled substances?</h3>
                <p className="text-gray-700">
                  Improper controlled substance disposal can result in severe consequences:
                </p>
                <ul className="mt-3 ml-6 space-y-1 list-disc">
                  <li><strong>DEA Fines:</strong> Up to $1.3 million per violation</li>
                  <li><strong>License Revocation:</strong> Loss of DEA registration</li>
                  <li><strong>Criminal Charges:</strong> Federal prosecution possible</li>
                  <li><strong>Medicare/Medicaid Exclusion:</strong> Cannot bill federal programs</li>
                  <li><strong>State Board Actions:</strong> Professional license suspension</li>
                  <li><strong>Joint Commission Sanctions:</strong> Accreditation issues</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">How often should controlled substances be disposed?</h3>
                <p className="text-gray-700">
                  DEA regulations don't specify disposal frequency, but best practices recommend quarterly disposal at minimum. Expired controlled substances should be disposed within 30 days. High-volume facilities may require monthly or bi-weekly pickups. Regular disposal reduces diversion risk and simplifies DEA audits.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Can I dispose of controlled substances myself?</h3>
                <p className="text-gray-700">
                  No, DEA registrants cannot dispose of controlled substances without proper authorization. Only DEA-registered reverse distributors, manufacturers, or facilities with on-site destruction methods approved by DEA can legally destroy controlled substances. Self-disposal violates federal law and can result in severe penalties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Below fold sections - Load dynamically */}
      <BelowFoldSections />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get DEA-Compliant Controlled Substance Disposal Today
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join 2,847 facilities that found their perfect DEA disposal partner through our network. 
            Form 41 processing, witness destruction, and full compliance included.
          </p>
          <FinalCTAButtons />
        </div>
      </section>

      {/* Related Services - Static HTML */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Related Services</h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/services/pharmaceutical-waste-disposal" className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
              <span className="font-semibold text-primary-600">Pharmaceutical Waste</span>
            </Link>
            <Link href="/services/hazardous-drug-waste" className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
              <span className="font-semibold text-primary-600">Hazardous Drug Waste</span>
            </Link>
            <Link href="/services/expired-medication-disposal" className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
              <span className="font-semibold text-primary-600">Expired Medications</span>
            </Link>
            <Link href="/services/hipaa-compliant-destruction" className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
              <span className="font-semibold text-primary-600">HIPAA Destruction</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Mobile CTA */}
      <FloatingMobileCTA />
    </>
  )
}