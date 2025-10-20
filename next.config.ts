import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'weact.local',
      },
      {
        protocol: 'https',
        hostname: 'weact.local',
      },
    ],
  },
};

export default nextConfig;
