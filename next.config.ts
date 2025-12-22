import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // basePath: "",
  // assetPrefix: "",
  output: 'standalone', // Enable standalone output for Docker
  images: {
    domains: ["cse.iittp.ac.in", "media.springernature.com", "old.iittp.ac.in"],
    unoptimized: true, // Add this line
  },
  async rewrites() {
    return [
      {
        // Google auth callback
        source: "/callback/google",
        destination: "/api/auth/callback/google",
      },
      {
        // Auth API routes
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        // Activity portal API routes
        source: "/api/activity-portal/:path*",
        destination: "/api/activity-portal/:path*",
      },
      {
        // Public API routes
        source: "/api/public/:path*",
        destination: "/api/public/:path*",
      },
    ];
  },
};

export default nextConfig;
