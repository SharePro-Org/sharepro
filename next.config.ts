import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Environment variables that will be available to the browser
  env: {
    NEXT_PUBLIC_API_URL:  "https://d9c66f997587.ngrok-free.app/graphql/",
  },
};

export default nextConfig;
