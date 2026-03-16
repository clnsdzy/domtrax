import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mini.s-shot.ru",
      },
    ],
  },
};

export default nextConfig;
