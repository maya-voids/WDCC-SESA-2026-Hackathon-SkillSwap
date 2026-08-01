import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.snapcdn.app",
        pathname: "/photo",
      },
      {
        protocol: "https",
        hostname: "www.aut.ac.nz",
        pathname: "/__data/assets/image/**",
      },
    ],
  },
};

export default nextConfig;
