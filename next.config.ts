// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // ✅ disables source map errors in dev
  
  // =========== ADD THIS IMAGES CONFIGURATION ===========
  images: {
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