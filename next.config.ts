import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Environment variables that will be available to the browser
  env: {
    NEXT_PUBLIC_API_URL:  "https://0a1180b3e64c.ngrok-free.app/graphql/",
  },
};

export default nextConfig;
