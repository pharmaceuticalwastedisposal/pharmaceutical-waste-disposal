import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow ALL crawlers (search engines + AI) for maximum visibility
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // API routes - no SEO value
          '/_next/',    // Next.js internals
          '/static/',   // Static assets
          '/private/',  // Private content
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  }
}