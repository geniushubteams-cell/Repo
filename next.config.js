/** @type {import('next').NextConfig} */
const nextConfig = {
  // ==========================================
  // 🚀 PRODUCTION OPTIMIZATIONS
  // ==========================================
  
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  
  // Enable response compression
  compress: true,
  
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  
  // Generate ETags for better caching
  generateEtags: true,
  
  // ==========================================
  // 📦 BUNDLE OPTIMIZATION
  // ==========================================
  
  webpack: (config, { dev, isServer, webpack }) => {
    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Production optimizations
      if (!dev) {
        // Enable module concatenation (scope hoisting)
        config.optimization.concatenateModules = true;
        
        // Optimize chunk splitting
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            // Disable default groups
            default: false,
            defaultVendors: false,
            
            // Framework chunk (React, Next.js)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            
            // Vendor chunk (other node_modules)
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            
            // Common chunk (shared code)
            common: {
              name: 'common',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
              enforce: true,
            },
            
            // Shared utilities
            lib: {
              test: /[\\/]app[\\/](shared|utils|services|hooks)[\\/]/,
              name: 'lib',
              priority: 25,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
          minSize: 20000,
          maxSize: 244000,
        };
        
        // Remove console.log in production
        config.optimization.minimize = true;
        config.optimization.minimizer = config.optimization.minimizer || [];
        
        // Add Terser plugin for advanced minification
        const TerserPlugin = require('terser-webpack-plugin');
        config.optimization.minimizer.push(
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                passes: 2,
              },
              mangle: true,
              output: {
                comments: false,
              },
            },
            extractComments: false,
          })
        );
      }
    }
    
    // Ignore source map warnings
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { message: /source-map-loader/ },
    ];
    
    return config;
  },
  
  // ==========================================
  // 🖼️ IMAGE OPTIMIZATION
  // ==========================================
  
  images: {
    // Allowed image domains
    domains: [
      'zyewxztfnrkrdknpipjc.supabase.co',
      'kxwuhxbuurfivsvbbzyq.supabase.co',
      'cdn.pwskills.com',
      'cdn.physicswallah.com',
      'd2bps9p1kiy4ka.cloudfront.net',
    ],
    
    // Modern image formats (WebP, AVIF)
    formats: ['image/avif', 'image/webp'],
    
    // Responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    
    // Cache optimized images for 7 days
    minimumCacheTTL: 604800,
    
    // Disable static image import optimization (use CDN)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // ==========================================
  // 🔬 EXPERIMENTAL FEATURES
  // ==========================================
  
  experimental: {
    // Optimize package imports (tree shaking)
    optimizePackageImports: [
      'react',
      'react-dom',
      'next',
      'scheduler',
    ],
    
    // Force SWC transforms for faster builds
    forceSwcTransforms: true,
    
    // Enable server actions
    serverActions: true,
  },
  
  // ==========================================
  // 📝 COMPILER OPTIONS
  // ==========================================
  
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // Enable React optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    
    // Remove data-testid in production
    removeReactProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-testid$'],
    } : false,
    
    // Styled-components support (if used)
    styledComponents: false,
  },
  
  // ==========================================
  // 🌐 HEADERS & CACHING
  // ==========================================
  
  async headers() {
    // No caching in both development and production (except API routes)
    const noCacheHeaders = [
      {
        key: 'Cache-Control',
        value: 'no-cache, no-store, must-revalidate, max-age=0',
      },
      {
        key: 'Pragma',
        value: 'no-cache',
      },
      {
        key: 'Expires',
        value: '0',
      },
    ];

    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ];

    return [
      // API routes - ONLY caching enabled
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
          ...securityHeaders,
        ],
      },
      
      // All other routes - NO caching
      {
        source: '/(.*)',
        headers: [
          ...noCacheHeaders,
          ...securityHeaders,
        ],
      },
    ];
  },
  
  // ==========================================
  // 🔄 REDIRECTS (Optional)
  // ==========================================
  
  async redirects() {
    return [
      // Add any redirects here if needed
    ];
  },
  
  // ==========================================
  // 🎯 ON-DEMAND ENTRIES (Development)
  // ==========================================
  
  onDemandEntries: {
    // Keep pages in memory for 60 seconds
    maxInactiveAge: 60 * 1000,
    // Keep 5 pages in memory
    pagesBufferLength: 5,
  },
  
  // ==========================================
  // 📊 OUTPUT CONFIGURATION
  // ==========================================
  
  // React strict mode
  reactStrictMode: true,
  
  // Trailing slash behavior
  trailingSlash: false,
  
  // ==========================================
  // 🔧 TYPESCRIPT (if used)
  // ==========================================
  
  typescript: {
    // Ignore TypeScript errors during build (not recommended)
    ignoreBuildErrors: false,
  },
  
  // ==========================================
  // 📱 PWA SUPPORT (Optional)
  // ==========================================
  
  // Add PWA configuration here if needed
  // webpack: (config) => {
  //   config.plugins.push(
  //     new (require('next-pwa'))({
  //       dest: 'public',
  //       disable: process.env.NODE_ENV === 'development',
  //     })
  //   );
  //   return config;
  // },
}

module.exports = nextConfig
