import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function calculateSavings(currentSpend: number): number {
  // Average 30-40% savings vs competitors
  return Math.round(currentSpend * 0.35)
}

export function getComplianceDeadline(): string {
  // EPA inspection season typically starts in March
  const now = new Date()
  const currentYear = now.getFullYear()
  const marchFirst = new Date(currentYear, 2, 1) // March 1st
  
  if (now > marchFirst) {
    marchFirst.setFullYear(currentYear + 1)
  }
  
  const daysUntil = Math.ceil((marchFirst.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return `${daysUntil} days until EPA inspection season`
}

export function generateLeadId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}