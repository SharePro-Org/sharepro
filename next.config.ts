import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  images: {
    unoptimized: true,
  },

  // Environment variables that will be available to the browser
  env: {
    NEXT_PUBLIC_API_URL:  "https://api.mysharepro.com/graphql/",
    NEXT_PUBLIC_WS_URL: "ws://api.mysharepro.com/ws/graphql/",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://app.mysharepro.com',
  },
};

export default nextConfig;
