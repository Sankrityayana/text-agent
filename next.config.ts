import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["http://192.168.56.1:3000", "https://192.168.56.1:3000"],
  },
};

export default nextConfig;
