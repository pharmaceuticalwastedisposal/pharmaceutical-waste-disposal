const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
  },
  // Enterprise-grade webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Development optimizations - balance speed with functionality
    if (dev) {
      // Essential optimizations that don't slow dev
      if (!isServer) {
        // Tree-shake Lucide icons even in dev
        config.resolve.alias = {
          ...config.resolve.alias,
          'lucide-react': require.resolve('lucide-react/dist/esm/icons')
        }
      }
      return config
    }
    
    // Production mode - enterprise-grade optimizations
    if (!isServer) {
      // Advanced bundle optimization
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
          chunks: 'all',
          maxSize: 200000, // 200KB chunks - enterprise standard
          minSize: 20000,  // Don't create chunks smaller than 20KB
          maxAsyncRequests: 30, // Allow more async chunks for better caching
          maxInitialRequests: 30,
          cacheGroups: {
            // Framework code (React, Next.js)
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: 'framework',
              chunks: 'all',
              priority: 40,
              enforce: true,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion)[\\/]/,
              name: 'ui-libs',
              chunks: 'all',
              priority: 30,
            },
            // Icons - separate chunk for optimal caching
            icons: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 25,
            },
            // Form libraries
            forms: {
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
              name: 'forms',
              chunks: 'all',
              priority: 20,
            },
            // Other vendor code
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              minChunks: 1,
            },
            // Common code used across pages
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              priority: 5,
            },
          },
        },
        // Enable module concatenation (webpack magic)
        concatenateModules: true,
      }
      
      // Enterprise-grade tree shaking and aliases
      config.resolve.alias = {
        ...config.resolve.alias,
        // Force tree-shakeable imports for Lucide
        'lucide-react': require.resolve('lucide-react/dist/esm/icons'),
        // Optimize lodash if used
        'lodash': 'lodash-es',
      }
      
      // Advanced module resolution for better tree shaking
      config.resolve.mainFields = ['module', 'main']
    }
    
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)