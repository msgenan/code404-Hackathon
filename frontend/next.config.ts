import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Enable standalone output for optimized Docker builds
  output: "standalone",
};

export default nextConfig;
