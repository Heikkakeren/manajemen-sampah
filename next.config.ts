import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Image optimization config
  images: {
    remotePatterns: [],
  },
  // Fix Vercel Prisma ENOENT
  outputFileTracingIncludes: {
    "/*": ["./prisma/schema.prisma"],
  },
  // Allow local uploads to be served
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
