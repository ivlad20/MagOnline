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
      // Pozele încărcate în backend-ul local (docker compose, app.storage=local)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],
    // Next.js blochează implicit optimizarea imaginilor de pe IP-uri locale; o permitem doar în dev.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;