"use client"

import { trackPageView } from "./supabase"

// Generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get or create session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('pharma_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem('pharma_session_id', sessionId)
  }
  return sessionId
}

// Extract UTM parameters from URL
function getUTMParams(): Record<string, string | undefined> {
  if (typeof window === 'undefined') return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
  }
}

// Track page view with enhanced data
export async function trackPageViewData(pageTitle: string) {
  if (typeof window === 'undefined') return
  
  const sessionId = getSessionId()
  const utmParams = getUTMParams()
  
  const pageData = {
    session_id: sessionId,
    page_url: window.location.href,
    page_title: pageTitle,
    time_on_page: 0, // Will be updated on page leave
    scroll_depth: 0,
    user_agent: navigator.userAgent,
    ip_address: '0.0.0.0', // Will be set by server
    ...utmParams,
  }
  
  await trackPageView(pageData)
}

// Track scroll depth
export function trackScrollDepth() {
  if (typeof window === 'undefined') return
  
  let maxScrollDepth = 0
  
  const updateScrollDepth = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollTop = window.pageYOffset
    const scrollDepth = Math.round((scrollTop / scrollHeight) * 100)
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth
    }
  }
  
  window.addEventListener('scroll', updateScrollDepth, { passive: true })
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', updateScrollDepth)
    return maxScrollDepth
  }
}

// Track CTA clicks
export function trackCTAClick(ctaName: string) {
  if (typeof window === 'undefined') return
  
  // Send event to analytics
  console.log(`CTA Clicked: ${ctaName}`)
  
  // Track with PostHog if available
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('cta_clicked', {
      cta_name: ctaName,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
    })
  }
  
  // Track with Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'click', {
      event_category: 'CTA',
      event_label: ctaName,
      value: 1,
    })
  }
}

// Track form interactions
export function trackFormStart(formName: string) {
  console.log(`Form Started: ${formName}`)
  
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('form_started', {
      form_name: formName,
      page_url: window.location.href,
    })
  }
}

export function trackFormStep(formName: string, step: number, totalSteps: number) {
  console.log(`Form Step: ${formName} - ${step}/${totalSteps}`)
  
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('form_step_completed', {
      form_name: formName,
      step: step,
      total_steps: totalSteps,
      completion_rate: (step / totalSteps) * 100,
    })
  }
}

export function trackFormComplete(formName: string) {
  console.log(`Form Completed: ${formName}`)
  
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('form_completed', {
      form_name: formName,
      page_url: window.location.href,
    })
  }
  
  // Track conversion with Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion tracking
      event_category: 'Lead Generation',
      event_label: formName,
      value: 1,
    })
  }
}

// Initialize analytics
export function initializeAnalytics() {
  if (typeof window === 'undefined') return
  
  // Initialize PostHog
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    const script = document.createElement('script')
    script.src = 'https://app.posthog.com/static/array.js'
    script.async = true
    script.onload = () => {
      ;(window as any).posthog = (window as any).posthog || []
      ;(window as any).posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        capture_pageview: false, // We'll handle this manually
        autocapture: true,
      })
    }
    document.head.appendChild(script)
  }
  
  // Initialize Plausible Analytics
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    const script = document.createElement('script')
    script.src = 'https://plausible.io/js/script.js'
    script.setAttribute('data-domain', process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
}