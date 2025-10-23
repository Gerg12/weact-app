import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Enable standalone output for Docker deployments
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'weact.local', // Your WordPress/WooCommerce domain
      // Add additional domains as needed
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },
  
  // Performance optimizations
  swcMinify: true,
  compress: true,
  
  // Disable telemetry
  ...(process.env.NEXT_TELEMETRY_DISABLED === '1' && {
    telemetry: {
      disabled: true,
    },
  }),
};

export default nextConfig;
