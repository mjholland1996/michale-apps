import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'production-media.gousto.co.uk',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
