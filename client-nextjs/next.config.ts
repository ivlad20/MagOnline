import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "s13emagst.akamaized.net",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      // Images uploaded to the local backend (docker compose, app.storage=local)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8088",
        pathname: "/uploads/**",
      },
    ],
    // Next.js blocks optimizing images from local IPs by default; allow it in dev only.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;