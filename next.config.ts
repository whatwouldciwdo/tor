import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable experimental profiler to prevent performance measurement errors
  experimental: {
    // @ts-ignore
    reactProfiler: false,
  },
};

export default nextConfig;
