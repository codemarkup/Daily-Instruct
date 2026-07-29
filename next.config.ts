// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // ✅ disables source map errors in dev
  
  async rewrites() {
    return [
      {
        source: '/hq/:path*',
        destination: '/admin/:path*',
      },
      {
        source: '/api/hq/:path*',
        destination: '/api/admin/:path*',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/', // Redirect direct /admin attempts to home
        permanent: false,
      },
      {
        source: '/api/admin/:path*',
        destination: '/', // Block direct api/admin attempts
        permanent: false,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'dailyinstruct.com',
          },
        ],
        destination: 'https://www.dailyinstruct.com/:path*',
        permanent: true,
      },
    ];
  },
  
  // =========== ADD THIS IMAGES CONFIGURATION ===========
  images: {
    minimumCacheTTL: 31536000, // Cache optimized images for 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allow all Cloudinary images
      },
      // Add localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // Add your Vercel domain
      {
        protocol: 'https',
        hostname: 'dailyinstruct.com',
        pathname: '/**',
      },
      // Add your custom domain if you have one
      // {
      //   protocol: 'https',
      //   hostname: 'dailyinstruct.com',
      //   pathname: '/**',
      // },
    ],
  },
  
  // Optional: If you want to use the older domains array (compatible with older Next.js)
  // domains: ['res.cloudinary.com', 'localhost', 'daily-instruct.vercel.app'],
  
  // Optional: Increase image optimization quality
  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;