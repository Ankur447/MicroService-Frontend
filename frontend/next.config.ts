import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      loaders: {
        // Configure loaders here if needed
      },
    },
  },
  webpack: (config) => {
    return config;
  },
  postcss: true
};

export default nextConfig;
