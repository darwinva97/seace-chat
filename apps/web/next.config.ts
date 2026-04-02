import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/db", "@repo/auth"],
  output: "standalone",
};

export default nextConfig;
