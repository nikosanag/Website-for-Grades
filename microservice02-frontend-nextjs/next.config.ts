import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  images: {
    unoptimized: true, // Required for static export
  },  // Allow static exports to work with dynamic content
  experimental: {
    // Next.js 15+ configurations for static export
  }
};

export default nextConfig;
