export const SITE_CONFIG = {
  name: "PharmaceuticalWasteDisposal.com",
  domain: "https://www.pharmaceuticalwastedisposal.com",
  title: "Licensed Pharmaceutical Waste Disposal | Same-Day Response",
  description: "Certified pharmaceutical waste disposal. Serving hospitals, pharmacies, and healthcare facilities nationwide. 100% compliance guarantee. Get instant quote.",
  phone: "+1 (855) 592-4560",
  phoneClean: "18555924560",
  email: "compliance@pharmaceuticalwastedisposal.com",
}

export const FACILITY_TYPES = [
  { value: "hospital", label: "Hospital" },
  { value: "retail-pharmacy", label: "Retail Pharmacy" },
  { value: "long-term-care", label: "Long-Term Care Facility" },
  { value: "clinic", label: "Medical Clinic" },
  { value: "veterinary", label: "Veterinary Practice" },
  { value: "research", label: "Research Facility" },
  { value: "other", label: "Other Healthcare Facility" },
]

export const WASTE_TYPES = [
  { value: "controlled", label: "Controlled Substances" },
  { value: "hazardous", label: "Hazardous Pharmaceutical Waste" },
  { value: "chemotherapy", label: "Chemotherapy Waste" },
  { value: "sharps", label: "Sharps & Needles" },
  { value: "expired", label: "Expired Medications" },
  { value: "classified", label: "Classified Pharmaceutical Waste" },
  { value: "specialty", label: "Specialty Drug Waste" },
]

export const VOLUME_RANGES = [
  { value: "small", label: "< 50 lbs/month", priceRange: "$150-300" },
  { value: "medium", label: "50-200 lbs/month", priceRange: "$300-600" },
  { value: "large", label: "200-500 lbs/month", priceRange: "$600-1200" },
  { value: "enterprise", label: "> 500 lbs/month", priceRange: "Custom pricing" },
]

export const COMPETITORS = [
  "Stericycle",
  "Waste Management",
  "Daniels Health",
  "US Ecology",
  "Clean Harbors",
  "Other",
  "None - First time",
]

export const TRUST_BADGES = [
  { text: "Licensed & Certified", icon: "shield" },
  { text: "Regulatory Compliant", icon: "check" },
  { text: "DOT Compliant", icon: "truck" },
  { text: "HIPAA Compliant", icon: "lock" },
]

export const COMPLIANCE_ALERTS = [
  "Regulatory audits increasing in California starting next week",
  "3 pharmacies fined $47,000 in Texas this month for improper disposal",
  "New pharmaceutical disposal requirements effective in 30 days",
  "Joint Commission increasing pharmaceutical waste inspections by 40%",
]

export const SOCIAL_PROOF = [
  { facility: "Memorial Hospital", location: "Los Angeles", savings: "$67,000/year" },
  { facility: "CVS Pharmacy #2847", location: "Chicago", savings: "$4,200/year" },
  { facility: "St. Mary's Medical Center", location: "Houston", savings: "$89,000/year" },
  { facility: "Walgreens #5621", location: "Phoenix", savings: "$3,800/year" },
]