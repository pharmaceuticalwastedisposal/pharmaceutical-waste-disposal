import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SITE_CONFIG } from "@/lib/constants"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"]
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: "Pharmaceutical Waste Disposal - America's Leading EPA Certified Company",
  description: "Pharmaceutical Waste Disposal - The nation's premier pharmaceutical waste management company. EPA certified, DEA registered, serving 2,847+ healthcare facilities nationwide. Same-day pickup, 100% compliance guarantee.",
  keywords: "pharmaceutical waste disposal, DEA drug disposal, medical waste management, controlled substance disposal, EPA certified waste disposal, hospital waste disposal, pharmacy waste disposal",
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    title: "Pharmaceutical Waste Disposal - America's Leading EPA Certified Company",
    description: "Pharmaceutical Waste Disposal - The nation's premier pharmaceutical waste management company. EPA certified, DEA registered, serving 2,847+ healthcare facilities nationwide. Same-day pickup, 100% compliance guarantee.",
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_CONFIG.domain}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Pharmaceutical Waste Disposal - EPA Certified, DEA Compliant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmaceutical Waste Disposal - America's Leading EPA Certified Company",
    description: "Pharmaceutical Waste Disposal - The nation's premier pharmaceutical waste management company. EPA certified, DEA registered, serving 2,847+ healthcare facilities nationwide. Same-day pickup, 100% compliance guarantee.",
    images: [`${SITE_CONFIG.domain}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "not-needed-with-dns-verification",
  // },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="canonical" href={SITE_CONFIG.domain} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_CONFIG.domain}/#organization`,
                  name: "Pharmaceutical Waste Disposal",
                  legalName: "Pharmaceutical Waste Disposal Company",
                  alternateName: ["Pharmaceutical Waste Disposal Services", "PharmaceuticalWasteDisposal.com"],
                  url: SITE_CONFIG.domain,
                  telephone: SITE_CONFIG.phone,
                  email: SITE_CONFIG.email,
                  description: "America's premier pharmaceutical waste management company serving 2,847+ healthcare facilities nationwide with EPA certified, DEA compliant disposal services.",
                  foundingDate: "2010",
                  knowsAbout: ["Pharmaceutical Waste Disposal", "DEA Controlled Substance Disposal", "EPA Hazardous Waste Management", "Medical Waste Compliance"],
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "US",
                  },
                  areaServed: {
                    "@type": "Country",
                    name: "United States"
                  },
                  serviceArea: {
                    "@type": "GeoCircle",
                    geoMidpoint: {
                      "@type": "GeoCoordinates",
                      latitude: 39.8283,
                      longitude: -98.5795
                    },
                    geoRadius: "2000000"
                  },
                  logo: `${SITE_CONFIG.domain}/logo.png`,
                  image: `${SITE_CONFIG.domain}/og-image.jpg`,
                  sameAs: [
                    "https://www.linkedin.com/company/pharmaceutical-waste-disposal",
                    "https://twitter.com/pharmawaste",
                  ],
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "2847",
                    bestRating: "5",
                    worstRating: "1"
                  },
                  contactPoint: [{
                    "@type": "ContactPoint",
                    telephone: "+1-855-592-4560",
                    contactType: "customer service",
                    contactOption: ["TollFree", "HearingImpairedSupported"],
                    areaServed: "US",
                    availableLanguage: ["English", "Spanish"],
                    hoursAvailable: {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      opens: "08:00",
                      closes: "18:00"
                    }
                  }, {
                    "@type": "ContactPoint",
                    telephone: "+1-855-592-4560",
                    contactType: "emergency",
                    contactOption: "TollFree",
                    areaServed: "US",
                    availableLanguage: "English",
                    hoursAvailable: {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                      opens: "00:00",
                      closes: "23:59"
                    }
                  }],
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Pharmaceutical Waste Disposal Services",
                    itemListElement: [
                      {
                        "@type": "Service",
                        name: "DEA Controlled Substance Disposal",
                        description: "Complete DEA-compliant disposal of Schedule I-V controlled substances with witness destruction and Form 41 documentation",
                        provider: {"@id": `${SITE_CONFIG.domain}/#organization`},
                        areaServed: "US",
                        hasOfferCatalog: {
                          "@type": "OfferCatalog",
                          name: "Controlled Substance Services",
                          itemListElement: [
                            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Schedule II-V Disposal"}},
                            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Witness Destruction"}},
                            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "DEA Form 41 Filing"}}
                          ]
                        }
                      },
                      {
                        "@type": "Service",
                        name: "RCRA Hazardous Pharmaceutical Waste",
                        description: "EPA-compliant disposal of P-listed and U-listed hazardous pharmaceutical waste with full manifest tracking",
                        provider: {"@id": `${SITE_CONFIG.domain}/#organization`},
                        areaServed: "US"
                      },
                      {
                        "@type": "Service",
                        name: "Chemotherapy Waste Management",
                        description: "Specialized handling and disposal of trace and bulk chemotherapy waste following USP 800 guidelines",
                        provider: {"@id": `${SITE_CONFIG.domain}/#organization`},
                        areaServed: "US"
                      }
                    ]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_CONFIG.domain}/#website`,
                  url: SITE_CONFIG.domain,
                  name: "Pharmaceutical Waste Disposal",
                  alternateName: "PharmaceuticalWasteDisposal.com",
                  description: "America's leading pharmaceutical waste disposal company - EPA certified, DEA registered, nationwide service",
                  about: {
                    "@type": "Thing",
                    name: "Pharmaceutical Waste Disposal Services",
                    description: "Professional medical waste management and controlled substance disposal services"
                  },
                  publisher: {
                    "@id": `${SITE_CONFIG.domain}/#organization`,
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${SITE_CONFIG.domain}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "MedicalBusiness",
                  name: SITE_CONFIG.name,
                  url: SITE_CONFIG.domain,
                  telephone: SITE_CONFIG.phone,
                  priceRange: "$$",
                  medicalSpecialty: "Pharmaceutical Waste Management",
                  availableService: [
                    {
                      "@type": "MedicalProcedure",
                      name: "DEA Controlled Substance Disposal",
                      procedureType: "Hazardous Waste Removal",
                    },
                    {
                      "@type": "MedicalProcedure",
                      name: "EPA Compliant Pharmaceutical Disposal",
                      procedureType: "Medical Waste Management",
                    },
                  ],
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": `${SITE_CONFIG.domain}/#breadcrumb`,
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: SITE_CONFIG.domain
                    }
                  ]
                },
                {
                  "@type": "LocalBusiness",
                  "@id": `${SITE_CONFIG.domain}/#localbusiness`,
                  name: "Pharmaceutical Waste Disposal",
                  image: `${SITE_CONFIG.domain}/og-image.jpg`,
                  priceRange: "$$",
                  telephone: SITE_CONFIG.phone,
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "US"
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 39.8283,
                    longitude: -98.5795
                  },
                  url: SITE_CONFIG.domain,
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "2847"
                  },
                  review: [
                    {
                      "@type": "Review",
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5"
                      },
                      author: {
                        "@type": "Person",
                        name: "Dr. Sarah Johnson"
                      },
                      reviewBody: "Outstanding pharmaceutical waste disposal service. They handle our controlled substances with complete compliance and professionalism. Saved us 40% compared to Stericycle."
                    },
                    {
                      "@type": "Review",
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5"
                      },
                      author: {
                        "@type": "Organization",
                        name: "Memorial Hospital"
                      },
                      reviewBody: "Best medical waste partner we've had in 20 years. Same-day emergency response saved us during a DEA inspection. Highly recommended for healthcare facilities."
                    }
                  ],
                  openingHoursSpecification: [
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      opens: "08:00",
                      closes: "18:00"
                    },
                    {
                      "@type": "OpeningHoursSpecification",
                      dayOfWeek: ["Saturday", "Sunday"],
                      opens: "00:00",
                      closes: "23:59",
                      description: "24/7 Emergency Service Available"
                    }
                  ]
                },
                {
                  "@type": "FAQPage",
                  mainEntity: [
                    {
                      "@type": "Question",
                      name: "What is pharmaceutical waste disposal?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Pharmaceutical waste disposal is the safe, compliant management and destruction of expired, unused, or contaminated medications from healthcare facilities. It includes controlled substances, hazardous drugs, and non-hazardous pharmaceuticals."
                      }
                    },
                    {
                      "@type": "Question", 
                      name: "How much does pharmaceutical waste disposal cost?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Pharmaceutical waste disposal costs typically range from $150-1,200 per month depending on volume, waste types, and pickup frequency. We offer 30-40% savings compared to major competitors like Stericycle."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Is your pharmaceutical waste disposal service DEA compliant?",
                      acceptedAnswer: {
                        "@type": "Answer", 
                        text: "Yes, we are fully DEA registered and EPA certified for pharmaceutical waste disposal. We provide complete compliance documentation, witness destruction certificates, and maintain all required records."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "What types of pharmaceutical waste do you handle?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "We handle all types of pharmaceutical waste including: DEA controlled substances (Schedule I-V), RCRA hazardous waste (P-listed and U-listed), chemotherapy drugs, non-hazardous pharmaceuticals, expired medications, contaminated sharps, and compounding waste. Our services cover everything from trace chemotherapy to bulk chemotherapy waste."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "How quickly can you pick up pharmaceutical waste?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "We offer same-day emergency pickup for compliance failures and urgent needs. Standard scheduled pickups are available weekly, bi-weekly, monthly, or quarterly. Most new customers receive their first pickup within 24-48 hours of signing up."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Do you provide pharmaceutical waste containers?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, we provide all necessary DOT-approved containers including: black containers for hazardous RCRA waste, blue containers for non-RCRA pharmaceuticals, yellow containers for trace chemotherapy, red sharps containers, and DEA-compliant controlled substance collection bins. Container exchange service is included."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "What states do you service for pharmaceutical waste disposal?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "We provide pharmaceutical waste disposal services nationwide across all 50 states. Major service areas include California, Texas, Florida, New York, Illinois, Pennsylvania, Ohio, Georgia, North Carolina, and Michigan. We have local partners in every major metropolitan area."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "How do you handle controlled substance disposal?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Our DEA-compliant controlled substance disposal includes: witnessed destruction by two authorized employees, DEA Form 41 completion and filing, video documentation when requested, reverse distribution for eligible returns, and complete chain of custody documentation. All destruction meets DEA non-retrievable standards."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "What documentation do you provide for compliance?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "We provide comprehensive compliance documentation including: certificates of destruction, DEA Form 41 for controlled substances, EPA hazardous waste manifests, state-required documentation, weight tickets, online compliance portal access, and annual compliance reports. All records are maintained for the required retention periods."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Do you offer training for pharmaceutical waste segregation?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, we provide free comprehensive training including: initial onsite training for all staff, annual refresher training, online training modules, waste segregation guides, compliance posters and quick reference cards, and 24/7 access to our online training portal. CEU credits are available for certain programs."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "What makes you different from Stericycle or Waste Management?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Unlike large corporations, we offer: 30-40% lower pricing with no hidden fees, dedicated account managers (not call centers), flexible contracts with no long-term locks, faster response times (same-day availability), specialized pharmaceutical expertise, and transparent pricing with no automatic price increases."
                      }
                    },
                    {
                      "@type": "Question",
                      name: "Can you help with failed inspection remediation?",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, we specialize in rapid inspection failure remediation including: 24/7 emergency response, immediate compliance assessment, corrective action planning, liaison with inspectors, staff retraining, documentation cleanup, and mock inspections to ensure ongoing compliance. Most failures are resolved within 24-48 hours."
                      }
                    }
                  ]
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}