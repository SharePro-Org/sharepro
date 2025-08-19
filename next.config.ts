import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Environment variables that will be available to the browser
  env: {
    NEXT_PUBLIC_API_URL:  "https://dc7e7fd04243.ngrok-free.app/graphql/",
  },
};

export default nextConfig;
