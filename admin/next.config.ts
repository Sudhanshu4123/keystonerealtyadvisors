import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/:path*',
      },
    ];
  },
};

export default nextConfig;
