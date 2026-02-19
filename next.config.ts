import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - User requested false to disable all indicators, potentially creating a type mismatch
  devIndicators: false,
  reactStrictMode: false,
};

export default nextConfig;
