import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true
  },
  transpilePackages: ["@dev-manthan-sharma/paw-ma--core"]
};

export default nextConfig;
