import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/thank-you/', '/_next/', '/static/', '/private/'],
        crawlDelay: 0,
      },
      {
        // Specific rules for major search engines
        userAgent: ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
        crawlDelay: 0,
      },
      {
        // Rules for AI/LLM crawlers
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'Claude-Web', 'PerplexityBot'],
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/', '/private/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  }
}