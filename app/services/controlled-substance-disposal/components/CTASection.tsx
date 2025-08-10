"use client"

import { ArrowRight } from "lucide-react"

interface CTASectionProps {
  text: string
}

export function CTASection({ text }: CTASectionProps) {
  const scrollToForm = () => {
    const element = document.getElementById('lead-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <button
      className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 h-12 rounded-md px-6"
      onClick={scrollToForm}
    >
      {text}
      <ArrowRight className="ml-2 h-5 w-5" />
    </button>
  )
}