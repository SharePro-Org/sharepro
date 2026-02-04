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

  // Environment variables that will be available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000/graphql/",
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:4000/ws/graphql/",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://app.mysharepro.com',
  },
};

export default nextConfig;
