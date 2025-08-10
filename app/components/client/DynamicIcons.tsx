"use client"

import dynamic from "next/dynamic"

// Lazy load less critical icons - EXACTLY as they were
export const Clock = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Clock })), { ssr: false })
export const AlertCircle = dynamic(() => import("lucide-react").then(mod => ({ default: mod.AlertCircle })), { ssr: false })
export const Star = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Star })), { ssr: false })
export const CheckCircle = dynamic(() => import("lucide-react").then(mod => ({ default: mod.CheckCircle })), { ssr: false })