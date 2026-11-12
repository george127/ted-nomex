import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_PROXY_URL ?? "https://ted-nomex-api.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;