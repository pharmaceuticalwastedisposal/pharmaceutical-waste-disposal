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
  verification: {
    google: "your-google-verification-code",
  },
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