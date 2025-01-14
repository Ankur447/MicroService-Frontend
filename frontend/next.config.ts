import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Update the loader configuration as needed
        "*.mdx": ["mdx-loader"],  // Example rule for `.mdx` files
      },
    },
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
