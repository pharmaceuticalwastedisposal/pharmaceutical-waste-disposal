"use client"

import { Users, Shield, Clock, FileCheck, Lock, TrendingDown } from "lucide-react"

interface IndustriesSectionProps {
  scrollToForm: () => void
}

export default function IndustriesSection({ scrollToForm }: IndustriesSectionProps) {
  const industries = [
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
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Industries Requiring Controlled Substance Disposal
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          We connect DEA registrants across all healthcare sectors with compliant disposal partners
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {industries.map((industry, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="text-primary-600 mb-4">{industry.icon}</div>
              <h3 className="text-xl font-bold mb-2">{industry.title}</h3>
              <p className="text-gray-600">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}