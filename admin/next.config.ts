import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/admin',
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
