import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Get the last modified date from Git history or file system
function getLastModified(filePath: string): string {
  try {
    // Try to get the last Git commit date for this file
    const gitDate = execSync(`git log -1 --format=%cI -- ${filePath} 2>/dev/null`, {
      encoding: 'utf-8',
      cwd: process.cwd(),
    }).trim()
    
    if (gitDate) {
      return gitDate
    }
  } catch {
    // Git command failed, fall back to file system
  }
  
  // Fallback to file system modified time
  try {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath)
      return stats.mtime.toISOString()
    }
  } catch {
    // File doesn't exist
  }
  
  // Ultimate fallback: current date
  return new Date().toISOString()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain
  
  // Map URLs to their source files for automatic date tracking
  const pageMap: Record<string, string> = {
    '/': 'app/page.tsx',
    '/services/controlled-substance-disposal': 'app/services/controlled-substance-disposal/page.tsx',
    '/pharmaceutical-waste-disposal-california': 'app/pharmaceutical-waste-disposal-california/page.tsx',
    '/pharmaceutical-waste-disposal-texas': 'app/pharmaceutical-waste-disposal-texas/page.tsx',
    '/pharmaceutical-waste-disposal-florida': 'app/pharmaceutical-waste-disposal-florida/page.tsx',
    '/pharmaceutical-waste-disposal-new-york': 'app/pharmaceutical-waste-disposal-new-york/page.tsx',
    '/stericycle-alternative': 'app/stericycle-alternative/page.tsx',
    '/thank-you': 'app/thank-you/page.tsx',
  }
  
  const pages: MetadataRoute.Sitemap = []
  
  // Homepage - always highest priority
  pages.push({
    url: baseUrl,
    lastModified: getLastModified(pageMap['/'] || 'app/page.tsx'),
    changeFrequency: 'daily',
    priority: 1.0,
  })
  
  // Service pages - high priority for SEO
  const servicePages = [
    '/services/controlled-substance-disposal',
  ]
  
  servicePages.forEach(page => {
    if (pageMap[page]) {
      pages.push({
        url: `${baseUrl}${page}`,
        lastModified: getLastModified(pageMap[page]),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    }
  })
  
  // Location pages - important for local SEO
  const locationPages = [
    '/pharmaceutical-waste-disposal-california',
    '/pharmaceutical-waste-disposal-texas',
    '/pharmaceutical-waste-disposal-florida',
    '/pharmaceutical-waste-disposal-new-york',
  ]
  
  locationPages.forEach(page => {
    if (pageMap[page]) {
      pages.push({
        url: `${baseUrl}${page}`,
        lastModified: getLastModified(pageMap[page]),
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    }
  })
  
  // Competitor comparison pages
  const competitorPages = [
    '/stericycle-alternative',
  ]
  
  competitorPages.forEach(page => {
    if (pageMap[page]) {
      pages.push({
        url: `${baseUrl}${page}`,
        lastModified: getLastModified(pageMap[page]),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  })
  
  // Utility pages - low priority
  if (pageMap['/thank-you']) {
    pages.push({
      url: `${baseUrl}/thank-you`,
      lastModified: getLastModified(pageMap['/thank-you']),
      changeFrequency: 'yearly',
      priority: 0.3,
    })
  }
  
  // Add pages that don't exist yet but should be in sitemap
  // These will use current date until the pages are created
  const plannedPages = [
    { url: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/contact', priority: 0.85, changeFrequency: 'monthly' as const },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/compliance', priority: 0.8, changeFrequency: 'monthly' as const },
  ]
  
  plannedPages.forEach(page => {
    pages.push({
      url: `${baseUrl}${page.url}`,
      lastModified: new Date().toISOString(), // Will auto-update when pages are created
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  })
  
  return pages
}