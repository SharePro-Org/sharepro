import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker (only in production)
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Enable turbopack for faster development builds (Next.js 15+)
    // Note: turbopack is now stable in Next.js 15
  }),

  images: {
    unoptimized: true,
  },
  turbopack: {}, // 👈 makes build succeed under Turbopack

  // File watching configuration for Docker
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Enable polling for file changes in Docker
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  // Environment variables are automatically loaded from .env files
  // NEXT_PUBLIC_* variables are exposed to the browser automatically in Next.js 15+
  // No need to explicitly define them here - just ensure they exist in your .env file
};

export default nextConfig;
// Force rebuild for env vars
